import Base from '../ngin/base.js';
import { html, events } from '../ngin/html.js';

export default class Factory extends Base {
    constructor(meta, env) {
        super(meta, env);
    }

    render() {
        const meta = this.meta;
        if (meta.selector != null) {
            this.setEleFromTemplate();
        } else {
            html.take(this.env.container).input.value(this.meta.val);
            this.ele = html.ctx;
        }
    }

    postRenderEvent(meta) {
        html.take(this.ele).event(events.change, (e) => meta.events.change({ com: this, event: e }));
    }

    static create(meta, env) { return new Factory(meta, env); }
}