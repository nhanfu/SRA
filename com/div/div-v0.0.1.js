import { html, events } from '../ngin/html.js';
import Base from '../ngin/base.js';

export default class Factory extends Base {
    constructor(meta, env) {
        super(meta, env);
    }

    render() {
        const meta = this.meta;
        if (meta.selector != null) {
            this.setEleFromTemplate();
        } else {
            html.take(this.env.container).div.label.text(this.meta.label);
            this.ele = html.ctx;
        }
    }

    postRenderEvent(meta) {
        if (meta.events != null && meta.events.click != null) {
            html.take(this.ele).event(events.click, (e) => meta.events.click({ com: this, event: e }));
        }
    }

    static create(meta, env) { return new Factory(meta, env); }
}