import { html } from '../html.js';
import Base from '../base.js';
import { eventName } from '../event.js';

export default class Input extends Base {
    constructor(meta, env) {
        super(meta, env);
    }

    render(meta) {
        this.renderInput(meta);
    }

    renderInput(meta) {
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
        this.tryBindEvent(eventName.input, this.entity[meta.field] = this.ele.value);
        const events = [eventName.change, eventName.input, eventName.focus, eventName.blur];
        events.forEach(e => this.tryBindEvent(e, meta));
    }

    updateView() {
        this.ele.value = this.entity[this.meta.field];
    }

    static create(meta, env) { return new Input(meta, env); }
}