import { html } from '../html.js';
import Base from '../base.js';
import { eventName } from '../event.js';
import Utils from '../utils.js';

export default class Div extends Base {
    constructor(meta, env) {
        super(meta, env);
    }

    async render(meta) {
        if (meta.templateUrl != null) {
            await this.loadTemplate(meta);
            return;
        }
        if (meta.selector != null) {
            this.setEleFromTemplate();
        } else {
            html.take(this.env).div.label.text(this.meta.label);
            this.ele = html.ctx;
        }
    }

    async loadTemplate(meta) {
        const template = await Utils.fetchText(meta.templateUrl);
        const div = document.createElement('div');
        div.innerHTML = template;
        while (div.firstChild) {
            this.parent.ele.appendChild(div.firstChild);
        }
        if (meta.selector != null) {
            this.setEleFromTemplate();
        } else {
            this.ele = this.env.firstChild;
        }
    }

    bindEvents(meta) {
        super.bindEvents(meta);
        this.tryBindEvent(eventName.click, meta);
    }

    static create(meta, env) { return new Div(meta, env); }
}