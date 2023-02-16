import { html } from '../../ngin/html.js';
import { eventName } from '../event.js';
import Input from '../input/input-v0.0.1.js';

export default class Number extends Input {
    constructor(meta, env) {
        super(meta, env);
    }

    static create(meta, env) { return new Number(meta, env); }
}