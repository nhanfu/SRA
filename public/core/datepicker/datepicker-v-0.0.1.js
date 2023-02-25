import Base from '../base.js';

class Datepicker extends Base {
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
}