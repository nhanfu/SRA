const meta = [
    {
        com: '../core/div/div-v0.0.1.js',
        selector: '#main',
        step1: '#step1',
        step2: '#step2',
        field: 'main',
        view: ['../form/login/index.html'],
        events: {
            DOMContentLoaded: (args) => {
                var loading = args.env.querySelector("#loading");
                args.ele.querySelector("#submit").addEventListener("click", async (e) => {
                    e.preventDefault();
                    loading.style.display = "block";
                    args.env.classList.remove("payment-step1");
                    args.env.classList.add("payment-step2");
                    var current = args.ele.querySelector(args.meta.step1);
                    var next = args.env.querySelector(args.meta.step2);
                    args.ele.classList.add("user-info");
                    next.classList.remove("d-none");
                    current.classList.add("d-none");
                    window.setTimeout(() => {
                        loading.style.display = "none";
                    }, 500)
                });

                args.ele.querySelector(".back-btn").addEventListener("click", async (e) => {
                    e.preventDefault();
                    loading.style.display = "block";
                    var current = args.ele.querySelector(args.meta.step2);
                    var next = args.env.querySelector(args.meta.step1);
                    args.env.classList.remove("payment-step2");
                    args.env.classList.add("payment-step1");
                    args.ele.classList.remove("user-info");
                    next.classList.remove("d-none");
                    current.classList.add("d-none");
                    window.setTimeout(() => {
                        loading.style.display = "none";
                    }, 500)
                });

                args.ele.querySelector(".banking").addEventListener("click", async (e) => {
                    e.preventDefault();
                    var current = args.ele.querySelector("#banking");
                    if (current.classList.contains("show")) {
                        current.classList.remove("show")
                        e.target.classList.remove("collapsed")
                        e.target.setAttribute("aria-expanded", false);
                    }
                    else {
                        current.classList.add("show");
                        e.target.setAttribute("aria-expanded", true);
                    }
                });
            }
        },
        layout: {
            get url() { return new URLSearchParams(location.search).get('layout') ?? '../form/layout.html' },
        },
        children: []
    }
]

export default meta;