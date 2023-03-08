import Base from '../../core/base.js';
import meta from './dashbord.meta-v.0.0.1.js';

class Dashboard extends Base {
    constructor() {
        super(meta);
    }
}

const bl = new Dashboard();
bl.render(bl.meta);