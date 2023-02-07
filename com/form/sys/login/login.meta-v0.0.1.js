const meta = [
    {
        com: '../input/input-v0.0.1.js',
        formId: 'username',
        field: 'username',
        parentId: 'form',
        events: {
            change: (arg) => {
                console.log(`Should login to the user ${arg.com.ele.value}`);
            },
            DOMContentLoaded: (args) => console.log(`The DOM element is ready`)
        }
    },
    {
        com: '../input/input-v0.0.1.js',
        parentId: 'form',
        formId: 'password',
        field: 'password',
        events: {
            change: (arg) => {
                console.log(`Should login with the password ${arg.com.ele.value}`);
            }
        }
    },
    {
        com: '../button/button-v0.0.1.js',
        parentId: 'form',
        formId: 'submit',
        events: {
            click: (arg) => {
                console.log(`This is another message`);
            }
        }
    },
]

export default meta;