import { DOMEvent, eventName } from "../core/event.js";
import Utils from "../core/utils.js";
import { html } from '../ngin/html.js';

export default class Base {
    constructor(meta, env) {
        this.meta = Array.isArray(meta) ? meta[0] : meta;
        this.meta.instance = this;
        this.parent = this.meta._parent != null ? this.meta._parent.instance : null;
        this.entity = this.meta.entity || this.parent.entity;
        this.env = env || { container: document.body };
        this.children = [];
        this.initEventSource();
        this.render(meta, env);
        this.bindEvents(meta);
    }

    initEventSource() {
        this.events = new DOMEvent();
        this.events.userInput = [];
        this.validationRules = [];
    }

    async render(meta) {
        this.setEleFromTemplate();
        const factoryMap = {};
        const componentMeta = Utils.flattern(meta, x => x.children);

        const tasks = componentMeta.map(async meta => await this.importCom(meta, factoryMap));
        await Promise.all(tasks);
        componentMeta.forEach(x => x.resolvedClass.create(x, this.env));
    }

    importCom(meta, factoryMap) {
        return new Promise((resolve, reject) => {
            import(meta.com).then(factory => {
                if (factory == null) return;
                if (factory.default == null && factory.Factory == null) {
                    meta.resolvedClass = factoryMap[meta.com];
                } else {
                    meta.resolvedClass = factory.Factory || factory.default;
                    factoryMap[meta.com] = meta.resolvedClass;
                }
                resolve(meta.resolvedClass);
            }).catch(error => reject(error));
        });
    }

    bindEvents(meta) {
        this.events.userInput.push(x => {
            this.dirty = true;
        });
        this.events.DOMContentLoaded.push(async (x) => {
            if (this.validationRules.length > 0) {
                this.validate();
            }
            this.events.invoke(eventName.DOMContentLoaded, meta, this);
        });
    }

    tryBindEvent(name, metaOrAction) {
        if (!name || !metaOrAction) return;
        if (Utils.isFunc(metaOrAction)) {
            this.ele.addEventListener(name, metaOrAction);
        } else if (metaOrAction.events && metaOrAction.events[name]) {
            this.ele.addEventListener(name, (e) => metaOrAction.events[name]({ com: this, event: e }));
        }
    }

    setEleFromTemplate() {
        if (this.meta.selector) {
            this.ele = this.env.container.querySelector(this.meta.selector);
            this.events.DOMContentLoaded.forEach(action => action.call(this, this));
        }
    }

    static create(meta, env) { return new Base(meta, env); }
}