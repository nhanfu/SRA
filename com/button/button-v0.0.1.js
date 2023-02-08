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
            html.take(this.env.container).button.text(this.meta.label);
            this.ele = html.ctx;
        }
    }

    postRenderEvent(meta) {
        html.take(this.ele).event(events.change, (e) => meta.events.change({ com: this, event: e }));
    }

    static create(meta, env) { return new Factory(meta, env); }
}