import { html } from '../../ngin/html.js';
import Base from '../../ngin/base.js';
import { eventName } from '../event.js';

export default class Div extends Base {
    constructor(meta, env) {
        super(meta, env);
    }

    render() {
        const meta = this.meta;
        if (meta.selector != null) {
            this.setEleFromTemplate();
        } else {
            html.take(this.env).div.label.text(this.meta.label);
            this.ele = html.ctx;
        }
    }

    bindEvents(meta) {
        super.bindEvents(meta);
        this.tryBindEvent(eventName.click, meta);
    }

    static create(meta, env) { return new Div(meta, env); }
}