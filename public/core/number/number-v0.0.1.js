import Input from '../input/input-v0.0.1.js';
import Utils from '../utils.js';

export default class Number extends Input {
    constructor(meta, env) {
        super(meta, env);
    }

    render(meta) {
        this.entity[meta.field] = this.getDecimalVal();
        super.render(meta);
    }

    getDecimalVal() {
        if (Utils.isNoU(this.entity)) return;
        let val = this.entity[this.meta.field];
        if (Utils.isNoU(val)) return null;
        return new System.Decimal(val);
    }

    static create(meta, env) { return new Number(meta, env); }
}