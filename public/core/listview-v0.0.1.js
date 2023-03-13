import Base from "./base.js";

export default class ListView extends Base {
    constructor(meta, env) {
        super(meta, env);
    }

    async render(meta) {
        if (this.ele == null && meta.selector) {
            this.setEleFromTemplate();
        };
        this.ele.innerHTML = null;
        await this.loadData(meta);
        const rows = meta.entity[meta.field];
        rows.forEach(rowData => {
            meta.children.forEach(async detailMeta => {
                detailMeta.entity = rowData;
                const wrapper = detailMeta.resolvedClass.create(detailMeta, this.ele);
                wrapper.parent = this;
                wrapper.parentEle = this.ele;
                this.addChild(wrapper);
            });
        });
    }

    async loadData(meta) {
        if (meta.entity[meta.field] != null) return;
    }

    static create(meta, env) {
        return new ListView(meta, env);
    }
}