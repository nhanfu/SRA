const meta = [
    {
        id: 'root',
        com: '../core/div-v0.0.1.js',
        selector: 'main section',
        field: 'form',
        entity: { email: 'nhannguyen@vus-etsc.edu.vn', password: '123456', code: 'ahihi' },
        events: {
            DOMContentLoaded: (args) => console.log(`The DOM element is ready`)
        },
        children: [
            {
                com: '../core/div-v0.0.1.js',
                field: 'form',
                parentSelector: 'footer',
                clearParent: true,
                template: { url: './simple.html' },
                children: [
                    {
                        com: '../core/input-v0.0.1.js',
                        selector: '#code',
                        field: 'code'
                    },
                ]
            },
            {
                com: '../core/number-v0.0.1.js',
                field: 'test',
                precision: 2,
                defaultVal: (arg) => {
                    return arg.entity.test || 8;
                },
                events: {
                    change: (arg) => {
                        console.log(`Should login to the user ${arg.com.ele.value}`);
                    }
                }
            },
            {
                com: '../core/input-v0.0.1.js',
                selector: '#email',
                field: 'email',
                events: {
                    change: (arg) => {
                        console.log(`Should login to the user ${arg.com.ele.value}`);
                    }
                }
            },
            {
                com: '../core/input-v0.0.1.js',
                selector: '#password',
                field: 'password',
                type: 'password',
                events: {
                    change: (arg) => {
                        console.log(`Should login with the password ${arg.com.ele.value}`);
                    }
                }
            },
            {
                com: '../core/input-v0.0.1.js',
                selector: '#rememberMe',
                field: 'rememberme',
                type: 'checkbox',
                events: {
                    input: (arg) => {
                        const { event, com } = arg;
                        console.log(`Should remember me: ${com.entity.rememberme}`);
                    }
                }
            },
            {
                com: '../core/button-v0.0.1.js',
                selector: '#submit',
                events: {
                    click: (arg) => {
                        const { com, event } = arg;
                        event.preventDefault();
                        const data = JSON.stringify(com.entity);
                        console.log(`This is the message of submit button, the data should be ${data}`);
                        com.entity.password = '';
                        com.parent.updateView();
                    }
                }
            },
        ]
    },
]

export default meta;