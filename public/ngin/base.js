import { DOMEvent, eventName } from "../core/event.js";
import Utils from "../core/utils.js";

export default class Base {
    constructor(meta, env) {
        this.meta = Array.isArray(meta) ? meta[0] : meta;
        this.meta.instance = this;
        this.parent = this.meta._parent != null ? this.meta._parent.instance : null;
        if (this.parent != null) {
            this.parent.children.push(this);
        }
        this.entity = this.meta.entity || this.parent.entity;
        this.env = env || document.body;
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
        componentMeta.forEach(x => x.resolvedClass.create(x, !Utils.isNoU(x._parent) ? x._parent.instance.ele : this.env));
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
            this.ele = this.env.querySelector(this.meta.selector);
            this.events.DOMContentLoaded.forEach(action => action.call(this, this));
        }
    }

    updateView() {
        const children = Utils.flattern(this.children, x => x.children);
        if (children == null || !children.length) return;
        children.forEach(x => x.updateView());
    }

    removeDom() {
        this.ele.remove();
    }

    dispose() {
        const index = this.parent.children.indexOf(this);
        this.parent.children.splice(index, 1);
        removeDom();
    }

    disposeChildren() {
        let leaves = this.getLeaves();
        if (Utils.isNoE(leaves)) return;
        while (!Utils.isNoE(leaves)) {
            leaves.forEach(leaf => {
                leaf.dispose();
            });
            leaves = this.getLeaves();
        }
    }

    getLeaves() {
        return Utils.flattern(this.children, x => x.children).filter(x => Utils.isNoE(x.children));
    }

    static create(meta, env) { return new Base(meta, env); }
}