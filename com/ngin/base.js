export default class Base {
    constructor(meta, env) {
        this.meta = meta;
        this.env = env || { container: document.body };
        this.children = [];
        this.preRenderEvents(meta);
        this.render(meta, env);
        this.postRenderEvent(meta);
    }

    preRenderEvents(meta) {
        this.events = {};
        this.events.userInput = [];
        this.events.userInput.push(x => {
            this.dirty = true;
        });
        this.validationRules = [];
        this.events.DOMContentLoaded = [];
        this.events.DOMContentLoaded.push(async (x) => {
            if (this.validationRules.length > 0) {
                this.validate();
            }
            if (meta != null && meta.events.DOMContentLoaded != null) {
                await meta.events.DOMContentLoaded.call(this, this);
            }
        });
    }

    async render() {
        this.setEleFromTemplate();
        const factoryMap = {};
        const tasks = this.meta.map(async meta => await this.importCom(meta, factoryMap));
        await Promise.all(tasks);
        this.meta.forEach(x => x.resolvedClass.create(x, this.env));
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
            });
        });
    }

    postRenderEvent(meta) {

    }

    setEleFromTemplate() {
        if (this.meta.selector) {
            this.ele = this.env.container.querySelector(this.meta.selector);
            this.events.DOMContentLoaded.forEach(action => action.call(this, this));
        }
    }

    static create(meta, env) { return new Base(meta, env); }
}