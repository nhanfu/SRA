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
        const comTask = this.meta.map(async x => x.task = await import(x.com));
        await Promise.all(comTask);
        this.meta.map(async meta => {
            if (meta.task.Factory == null) {
                return;
            }
            const instance = meta.task.Factory.create(meta, this.env);
            delete meta.task;
            await instance.render();
        });
    }

    postRenderEvent(meta) {

    }

    setEleFromTemplate() {
        if (this.meta.formId) {
            this.ele = this.env.container.querySelector(`#${this.meta.formId}`);
            this.events.DOMContentLoaded.forEach(action => action.call(this, this));
        }
    }

    static create(meta, env) { return new Base(meta, env); }
}