const meta = [
    {
        com: '../core/div/div-v0.0.1.js',
        selector: '#container',
        field: 'form',
        events: {
            DOMContentLoaded: (args) => console.log(`The DOM element is ready`)
        }
    },
    {
        com: '../core/input/input-v0.0.1.js',
        selector: '#username',
        field: 'username',
        parentId: 'form',
        events: {
            change: (arg) => {
                console.log(`Should login to the user ${arg.com.ele.value}`);
            }
        }
    },
    {
        com: '../core/input/input-v0.0.1.js',
        parentId: 'form',
        selector: '#password',
        field: 'password',
        events: {
            change: (arg) => {
                console.log(`Should login with the password ${arg.com.ele.value}`);
            }
        }
    },
    {
        com: '../core/button/button-v0.0.1.js',
        parentId: 'form',
        selector: '#submit',
        events: {
            click: (arg) => {
                console.log(`This is another message`);
            }
        }
    },
]

export default meta;