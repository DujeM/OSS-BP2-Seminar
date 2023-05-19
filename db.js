const db = [
    {
        relation: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
        dependencies: [
            {
                lhs: ['A'],
                rhs: ['B']
            },
            {
                lhs: ['B'],
                rhs: ['C']
            },
            {
                lhs: ['C'],
                rhs: ['A']
            },
            {
                lhs: ['D'],
                rhs: ['E']
            },
            {
                lhs: ['G'],
                rhs: ['J']
            }
        ]
    },
    {
        relation: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
        dependencies: [
            {
                lhs: ['A'],
                rhs: ['B', 'C']
            },
            {
                lhs: ['B'],
                rhs: ['C', 'D']
            },
            {
                lhs: ['D'],
                rhs: ['E', 'F']
            },
            {
                lhs: ['D'],
                rhs: ['E', 'F']
            },
            {
                lhs: ['C', 'D'],
                rhs: ['j']
            },
        ]
    },
    {
        // primjer 1 nije u 3 nf zbog tranzitivne funk ABCD->E->F
        relation: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
        dependencies: [{
            lhs: ['A', 'B', 'C', 'D'],
            rhs: ['E', 'F', 'G', 'H', 'I', 'J']
        },{
            lhs: ['A', 'B', 'C'],
            rhs: ['D']
        },{
            lhs: ['C', 'D'],
            rhs: ['G', 'H']
        },{
            lhs: ['E'],
            rhs: ['F']
        },{
            lhs: ['G', 'H'],
            rhs: ['J']
        }] 
    },
    {
        relation: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
        dependencies: [{
            lhs: ['A'],
            rhs: ['C']
        },{
            lhs: ['B'],
            rhs: ['D']
        },{
            lhs: ['A'],
            rhs: ['E']
        },{
            lhs: ['A', 'C'],
            rhs: ['B']
        },{
            lhs: ['D'],
            rhs: ['A']
        }] 
    },
    {
        relation: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
        dependencies: [{
            lhs: ['B'],
            rhs: ['C', 'D']
        },{
            lhs: ['F'],
            rhs: ['J']
        },{
            lhs: ['G'],
            rhs: ['H', 'A']
        },{
            lhs: ['A', 'C'],
            rhs: ['B']
        },{
            lhs: ['D'],
            rhs: ['A']
        }] 
    }
];