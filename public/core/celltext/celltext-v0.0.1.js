import Base from "../base.js";
import { html } from '../html.js';

export default class CellText extends Base {
    constructor(meta, env) {
        super(meta, env);
    }

    preRender(meta) {
        if (meta.selector != null) {
            this.setEleFromTemplate();
        } else {
            const parent = this.env ?? this.parent?.ele;
            const selector = meta.selector || `[data-field="${meta.field}"]`
            this.ele = parent.querySelector(selector);
        }
    }

    render(meta) {
        html.take(this.ele).className('cell-text').text(this.entity[meta.field]);
    }

    static create(meta, env) { return new CellText(meta, env); }
}