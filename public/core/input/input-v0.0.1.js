import Base from '../../ngin/base.js';
import { html } from '../../ngin/html.js';
import { eventName } from '../event.js';

export default class Input extends Base {
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
        this.tryBindMetaEvent(eventName.change, meta);
    }

    static create(meta, env) { return new Input(meta, env); }
}