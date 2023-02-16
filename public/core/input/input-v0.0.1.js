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
            html.take(this.env).input.value(this.meta.val);
            this.ele = html.ctx;
        }
        this.ele.type = meta.type || 'input';
        this.ele.value = this.entity[meta.field];
    }

    bindEvents(meta) {
        super.bindEvents(meta);
        this.tryBindEvent(eventName.change, () => this.entity[meta.field] = this.ele.value);
        this.tryBindEvent(eventName.change, meta);
    }

    updateView() {
        this.ele.value = this.entity[this.meta.field];
    }

    static create(meta, env) { return new Input(meta, env); }
}