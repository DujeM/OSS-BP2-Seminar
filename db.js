const db = [
    {
        // primjer 1 nije u 3 nf zbog tranzitivne funk ABCD->E->F
        example: {
            R: "A B C D E F G H I J",
            FO: [{
                lhs: "A B C D",
                rhs: "E F G H I J"
            },{
                lhs: "A B C",
                rhs: "D"
            },{
                lhs: "C D",
                rhs: "G H"
            },{
                lhs: "E",
                rhs: "F"
            },{
                lhs: "G H",
                rhs: "J"
            }] 
        }
    },
    {
        example: {
            R: "A B C D E F G H I J",
            FO: [{
                lhs: "A",
                rhs: "C"
            },{
                lhs: "B",
                rhs: "D"
            },{
                lhs: "A",
                rhs: "E"
            },{
                lhs: "A C",
                rhs: "B"
            },{
                lhs: "D",
                rhs: "A"
            }] 
        },
    },
    {
        example: {
            R: "A B C D E F G H I J",
            FO: [{
                lhs: "A B",
                rhs: "D C"
            },{
                lhs: "D",
                rhs: "A"
            },{
                lhs: "C",
                rhs: "I"
            },{
                lhs: "A C",
                rhs: "H"
            },{
                lhs: "D",
                rhs: "J"
            }] 
        } 
    },
    {
        example: {
            R: "A B C D E F G H I J",
            FO: [{
                lhs: "A",
                rhs: "C"
            },{
                lhs: "B",
                rhs: "D"
            },{
                lhs: "A",
                rhs: "E"
            },{
                lhs: "A C",
                rhs: "B"
            },{
                lhs: "D",
                rhs: "A"
            }] 
        },
    },
    {
        example: {
            R: "A B C D E F G H I J",
            FO: [{
                lhs: "A",
                rhs: "C"
            },{
                lhs: "B",
                rhs: "D"
            },{
                lhs: "A",
                rhs: "E"
            },{
                lhs: "A C",
                rhs: "B"
            },{
                lhs: "D",
                rhs: "A"
            }] 
        },
    }
];