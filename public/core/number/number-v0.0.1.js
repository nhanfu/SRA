import { RoundMethodEnum, InputTypeEnum } from '../enums.js';
import { eventName } from '../event.js';
import Input from '../input/input-v0.0.1.js';
import Utils from '../utils.js';

export default class Number extends Input {
    setSelection = false;
    constructor(meta, env) {
        super(meta, env);
    }

    render(meta) {
        this.entity[meta.field] = this.getDecimalVal();
        super.renderInput(meta);
        this.ele.type = InputTypeEnum.Tel;
        this.ele.setAttribute("autocorrect", "off");
        this.ele.setAttribute("spellcheck", "false");
        this.ele.autocomplete = 'off';
    }

    bindEvents(meta) {
        this.tryBindEvent(eventName.input, () => {
            if (Utils.isNoU(this.entity)) return;
            this.entity[this.meta.field] = this.tryParseVal(this.ele);
        });
        const events = [eventName.change, eventName.input, eventName.focus, eventName.blur];
        events.forEach(e => this.tryBindEvent(e, meta));
    }

    tryParseVal(ele) {
        if (ele == null || Utils.isNoU(ele.value)) return;
        const val = System.Convert.toDecimal(ele.value.replaceAll(',', ''));
        const precision = this.meta.precision || 0;
        const finalVal = System.Decimal.round(val, precision, RoundMethodEnum.Ceil);
        const dotCount = Array.from(ele.value).filter(x => x == ',').length;
        const selectionEnd = this.ele.selectionEnd;
        ele.value = System.String.format(`{0:n${precision}}`, finalVal);
        const addedDot = Array.from(ele.value).filter(x => x === ',') - dotCount;
        if (this.setSelection) {
            this.ele.selectionStart = selectionEnd + addedDot;
            this.ele.selectionEnd = selectionEnd + addedDot;
        }
        return finalVal;
    }

    getDecimalVal() {
        if (Utils.isNoU(this.entity)) return;
        let val = this.entity[this.meta.field];
        if (Utils.isNoU(val)) return null;
        return new System.Decimal(val);
    }

    static create(meta, env) { return new Number(meta, env); }
}