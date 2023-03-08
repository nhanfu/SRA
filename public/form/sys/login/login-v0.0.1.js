import Base from '../../../core/base.js';
import meta from './login.meta-v0.0.1.js';

export class Login extends Base {
    constructor() {
        super(meta);
    }
}

const login = new Login();
await login.render(login.meta);