const meta = [
    {
        com: '../core/div/div-v0.0.1.js',
        selector: '#container',
        field: 'form',
        entity: { username: 'nhannguyen', password: '123456' },
        events: {
            DOMContentLoaded: (args) => console.log(`The DOM element is ready`)
        },
        children: [
            {
                com: '../core/input/input-v0.0.1.js',
                selector: '#username',
                field: 'username',
                events: {
                    change: (arg) => {
                        console.log(`Should login to the user ${arg.com.ele.value}`);
                    }
                }
            },
            {
                com: '../core/input/input-v0.0.1.js',
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
                com: '../core/button/button-v0.0.1.js',
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