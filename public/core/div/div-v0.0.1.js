import { html } from '../html.js';
import Base from '../base.js';
import { eventName } from '../event.js';

export default class Div extends Base {
    constructor(meta, env) {
        super(meta, env);
    }

    preRender(meta) {
        if (meta.template != null) {
            this.renderFromTemplate(meta);
            return;
        }
        if (meta.selector != null) {
            this.setEleFromTemplate();
        } else {
            html.take(this.env).div.label.text(this.meta.label);
            this.ele = html.ctx;
        }
    }

    render(meta) {
        if (this.parentEle == null) return;
        const div = this.innerDOM;
        const shouldWrap = div.childElementCount > 1;
        if (shouldWrap) {
            this.parentEle.appendChild(div);
            this.ele = div;
        } else {
            this.ele = div.firstChild;
            this.parentEle.appendChild(div.firstChild);
        }
        if (meta.selector != null) {
            this.setEleFromTemplate();
        }
    }

    bindEvents(meta) {
        super.bindEvents(meta);
        this.tryBindEvent(eventName.click, meta);
    }

    renderFromTemplate(meta) {
        if (meta.template == null) return;
        const div = document.createElement('div');
        div.innerHTML = meta.template;
        if (div.childElementCount == 0) return;
        this.innerDOM = div;
    }

    static create(meta, env) { return new Div(meta, env); }
}