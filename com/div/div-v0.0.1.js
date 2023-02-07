import { html, events } from '../ngin/html.js';
import Base from '../ngin/base.js';

export default class Factory extends Base {
    constructor(meta, env) {
        this.meta = meta;
        this.env = env;
    }

    render() {
        const meta = this.meta;
        if (meta.formId != null) {
            this.setEleFromTemplate();
        } else {
            html.take(this.env.container).div.label.text(this.meta.label);
            this.ele = html.ctx;
        }
    }

    postRenderEvent(meta) {
        html.take(this.ele).event(events.click, (e) => meta.events.click({ com: this, event: e }));
    }

    static create(meta, env) { return new Factory(meta, env); }
}