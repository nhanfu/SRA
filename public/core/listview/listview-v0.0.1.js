import Base from "../base.js";

export default class ListView extends Base {
    constructor(meta, env) {
        super(meta, env);
    }

    preRender(meta) {
        this.setEleFromTemplate();
    }

    async render(meta) {
        if (this.ele == null) return;
        this.ele.innerHTML = null;
        await this.loadData(meta);
        const rows = meta.entity[meta.field];
        rows.forEach(rowData => {
            meta.children.forEach(detailMeta => {
                detailMeta.entity = rowData;
                const wrapper = detailMeta.resolvedClass.create(detailMeta, this.ele);
                wrapper.parent = this;
                wrapper.parentEle = this.ele;
                this.addChild(wrapper);
                wrapper.resolveChildren(meta, x => x.children, x => true);
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