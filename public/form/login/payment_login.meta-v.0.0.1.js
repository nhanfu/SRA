import Utils from "/core/utils.js";
const meta = [
    {
        com: '../core/div/div-v0.0.1.js',
        selector: '#main',
        field: 'main',
        view: '../form/login/index.html',
        view2: '../form/login/index2.html',
        events: {
            DOMContentLoaded: (args) => {
                args.ele.querySelector("#submit").addEventListener("click", async (e) => {
                    e.preventDefault();
                    args.ele = args.env.querySelector(args.meta.selector);
                    args.ele.classList.add("user-info");
                    var template = await Utils.fetchText(args.meta.view2);
                    args.ele.innerHTML = template;
                });
            }
        },
        layout: {
            url: '../form/layout.html'
        },
        children: []
    }
]

export default meta;