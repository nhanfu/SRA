const meta = [
    {
        com: '../core/listview-v0.0.1.js',
        selector: '#overview',
        field: 'overview',
        entity: {
            overview: [
                {
                    title: `Today's Money`,
                    value: 53_000,
                    change: 55,
                    increase: true
                },
                {
                    title: `Today's User`,
                    value: 53_000,
                    change: 3,
                    increase: true
                },
                {
                    title: `New Clients`,
                    value: 3_462,
                    change: -2,
                    increase: false
                },
                {
                    title: `Sales`,
                    value: 103_430,
                    change: 5,
                    increase: true
                }
            ]
        },
        lazyLoad: true,
        children: [
            {
                com: '../core/div-v0.0.1.js',
                field: 'overview',
                lazyLoad: true,
                template: {
                    url: '../form/bl/overview.html'
                },
                children: [
                    {
                        com: '../core/celltext-v0.0.1.js',
                        field: 'title',
                        events: {
                            click: (args) => alert(`User just click on ${args.com.entity.title}`)
                        },
                    },
                    {
                        com: '../core/celltext-v0.0.1.js',
                        field: 'change',
                        events: {
                            click: (args) => alert(`User just click on ${args.com.entity.change}`)
                        },
                    }
                ]
            }
        ],
    }
]

export default meta;