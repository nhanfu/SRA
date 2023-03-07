import Base from "../base.js";

class ListView extends Base {
    constructor(meta, env) {
        super(meta, env);
    }

    async postRender(meta) {
        this.setEleFromTemplate();
        await this.loadData();
    }

    async loadData(meta) {
        if (meta.entity[meta.field] != null) return;
    }
}