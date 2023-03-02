export default class Utils {
    static isNoU(obj) {
        return obj === null || obj === undefined;
    }

    static isNoE(obj) {
        return this.isNoU(obj) || !obj.length;
    }

    static isFunc(x) {
        return typeof(x) === 'function';
    }

    static flattern(arr, expr) {
        if (arr == null || !arr.length) return arr;
        if (!expr ) return arr;

        const children = arr.map(item => {
                const children = expr(item);
                if (this.isNoU(children)) return children;
                children.forEach(child => {
                    if (!this.isNoU(child._parent)) return;
                    child._parent = item;
                });
                return children;
            })
            .filter(parentItem => !this.isNoU(parentItem))
            .flatMap(children => children);
        if (children == null || !children.length) return arr;
        return arr.concat(Utils.flattern(children));
    }

    static async fetchText(url) {
        const response = await fetch(url);
        return response.text();
    }
}