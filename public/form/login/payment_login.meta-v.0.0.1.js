const meta = [
    {
        com: '../core/div/div-v0.0.1.js',
        selector: '#main',
        field: 'main',
        view: '../form/login/index.html',
        events: {
            DOMContentLoaded: (args) => {
                console.log(args);
            }
        },
        layout: {
            url: '../form/layout.html'
        },
        children: []
    }
]

export default meta;