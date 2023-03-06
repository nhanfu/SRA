import { DOMEvent, eventName } from "./event.js";
import Utils from "./utils.js";

export default class Base {
    _dirty = false;
    _noDirty = false;
    _alwaysValid = false;

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
        this.setDefault();
        this.initEventSource();
        this.setParentEle(this.meta);
        this.render(this.meta, env);
        this.bindEvents(this.meta);
    }

    initEventSource() {
        this.events = new DOMEvent();
        this.events.userInput = [];
        this.validationRules = [];
    }

    async render(meta) {
        this.setEleFromTemplate();
        const factoryMap = {};
        const componentMeta = Utils.flattern(meta.children, x => x.children);
        meta.children.forEach(x => x._parent = meta);
        componentMeta.splice(0, 0, meta);
        await this.loadTemplate(componentMeta);
        const tasks = componentMeta.map(async meta => await this.importCom(meta, factoryMap));
        await Promise.all(tasks);
        componentMeta.forEach(x => {
            x.resolvedClass.create(x, !Utils.isNoU(x._parent) ? x._parent.instance.ele : this.env);
            delete x.resolvedClass;
        });
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

    getLeaves(predicate) {
        return Utils.flattern(this.children, x => x.children).filter(x => predicate == null || predicate(x) && Utils.isNoE(x.children));
    }

    get dirty() {
        return this._dirty || this.getLeaves(x => !x._noDirty).some(x => x._dirty);
    }

    setDefault() {
        if (this.entity == null) return;
        const id = this.entity.Id || this.entity.id;
        if (id != null || this.meta.defaultVal == null) return;
        this.entity[this.meta.field] = this.meta.defaultVal(this);
    }

    async loadTemplate(meta) {
        if (meta == null || !meta.length) return;
        const templates = meta.filter(x => x.templateUrl != null).map(async x => {
            x.template = await Utils.fetchText(x.templateUrl);
        });
        await Promise.all(templates);
    }

    setParentEle(meta) {
        if (meta.parentSelector == null) return;
        const root = this.parent?.env ?? document.body;
        this.parentEle = root.querySelector(meta.parentSelector);
        if (this.parentEle != null && meta.clearParent) {
            this.parentEle.innerHTML = null;
        }
    }

    static create(meta, env) { return new Base(meta, env); }
}