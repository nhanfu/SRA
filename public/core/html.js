class Html {
    #tags = ['a', 'abbr', 'address', 'area', 'article', 'aside', 'audio', 'b', 'base', 'bdi', 'bdo',
        'blockquote', 'button', 'canvas', 'caption', 'cite', 'code', 'col', 'colgroup', 'datalist',
        'dd', 'del', 'details', 'dfn', 'div', 'dl', 'dt', 'em', 'embed', 'fieldset', 'figcaption',
        'figure', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'head', 'header', 'i', 'iframe',
        'img', 'input', 'ins', 'kbd', 'keygen', 'label', 'legend', 'li', 'link', 'main', 'map', 'mark',
        'menu', 'menuitem', 'meta', 'meter', 'nav', 'object', 'ol', 'ptgroup', 'option', 'output', 'p',
        'param', 'pre', 'progress', 'q', 'rp', 'rt', 'ruby', 's', 'samp', 'script', 'section', 'select',
        'small', 'source', 'span', 'strong', 'style', 'sub', 'summary', 'sup', 'table', 'tbody', 'td',
        'textarea', 'tfoot', 'th', 'thead', 'time', 'title', 'tr', 'track', 'u', 'ul', 'var', 'video'];
    
    constructor() {
        this.#tags.forEach(x => this.defineTag(x));
        this.defindSelfClosingTag();
    }

    defineTag(tag) {
        Object.defineProperty(this, tag, {
            get: () => {
                var createdEle = document.createElement(tag);
                if (this.ctx == null) {
                    this.ctx = createdEle;
                } else {
                    this.ctx.appendChild(createdEle);
                    this.ctx = createdEle;
                }
                return this;
            }
        });
    }

    defindSelfClosingTag() {
        ['hr', 'br'].forEach((tag) => {
            Object.defineProperty(this, tag, {
              get: function () {
                ctx.appendChild(document.createElement(tag));
                return this;
              }
            });
          });
    }

    event(name, handler) {
        this.ctx.addEventListener(name, handler);
        return this;
    }

    take(ele) {
        this.ctx = ele || document.body;
        return this;
    }

    attr(obj) {
        for (var prop in obj) {
            this.ele.setAttribute(prop, obj[prop]);
        }
        return this;
    }

    style(obj) {
        for (var prop in obj) {
            this.ele.style[prop] = obj[prop];
        }
        return this;
    }

    text(key, value) {
        this.#setProp('innerText', key, value);
        return this;
    }

    value(key, value) {
        this.#setProp('value', key, value);
        return this;
    }

    #setProp(prop, key, value) {
        if (value === null || value === undefined) {
            value = key;
        }
        this.ctx[prop] = value;
        const cache = prop + '_key';
        this.ctx[cache] = this.ctx[cache] || {};
        this.ctx[cache][prop] = key;
    }
}

const instance = new Html();

export { Html, instance as html }