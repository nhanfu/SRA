const eventName = {
    click: 'click',
    contextmenu: 'contextmenu',
    dblclick: 'dblclick',
    mousedown: 'mousedown',
    mouseenter: 'mouseenter',
    mouseleave: 'mouseleave',
    mousemove: 'mousemove',
    mouseover: 'mouseover',
    mouseout: 'mouseout',
    mouseup: 'mouseup',
    keydown: 'keydown',
    keypress: 'keypress',
    keyup: 'keyup',
    abort: 'abort',
    beforeunload: 'beforeunload',
    error: 'error',
    hashchange: 'hashchange',
    load: 'load',
    resize: 'resize',
    scroll: 'scroll',
    unload: 'unload',
    blur: 'blur',
    change: 'change',
    input: 'input',
    focus: 'focus',
    focusin: 'focusin',
    focusout: 'focusout',
    inputting: 'inputting',
    invalid: 'invalid',
    reset: 'reset',
    search: 'search',
    select: 'select',
    submit: 'submit',
    drag: 'drag',
    dragend: 'dragend',
    dragenter: 'dragenter',
    dragleave: 'dragleave',
    dragover: 'dragover',
    dragstart: 'dragstart',
    drop: 'drop',
    copy: 'copy',
    cut: 'cut',
    paste: 'paste',
    afterprint: 'afterprint',
    beforeprint: 'beforeprint',
    canplay: 'canplay',
    canplaythrough: 'canplaythrough',
    durationchange: 'durationchange',
    emptied: 'emptied',
    ended: 'ended',
    error: 'error',
    loadeddata: 'loadeddata',
    loadedmetadata: 'loadedmetadata',
    loadstart: 'loadstart',
    pause: 'pause',
    play: 'play',
    playing: 'playing',
    progress: 'progress',
    ratechange: 'ratechange',
    seeked: 'seeked',
    seeking: 'seeking',
    stalled: 'stalled',
    suspend: 'suspend',
    timeupdate: 'timeupdate',
    volumechange: 'volumechange',
    waiting: 'waiting',
    animationend: 'animationend',
    animationiteration: 'animationiteration',
    animationstart: 'animationstart',
    transitionend: 'transitionend',
    message: 'message',
    online: 'online',
    offline: 'offline',
    popstate: 'popstate',
    show: 'show',
    storage: 'storage',
    toggle: 'toggle',
    wheel: 'wheel',
    compositionend: 'compositionend',
    compositionstart: 'compositionstart',
    DOMContentLoaded: 'DOMContentLoaded',
};

class DOMEvent {
    constructor() {
        for (var e in eventName) {
            this.defineEvent(e);
        }
    }

    defineEvent(name) {
        Object.defineProperty(this, name, {
            get: () => {
                const backingField = '#_' + name;
                if (this[backingField] == null) {
                    this[backingField] = [];
                }
                return this[backingField];
            }
        });
    }

    addEventListener(name, handler) {
        if (this[name] == null) {
            this[name] = [];
        }
        this[name].push(handler);
    }

    async invoke(name, meta, com) {
        if (!name || !meta || !meta.events || !meta.events[name]) return;
        await meta.events[name].call(com, com);
    }
}

export { DOMEvent, eventName };