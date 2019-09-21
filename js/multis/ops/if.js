if (typeof multis === "undefined") multis = {};

// class IfStore extends multis.Container {
//     constructor(parent) {
//         super(parent);
//     }
// }

class IfOp extends multis.Event {
    constructor() {
        super();

        // this.use((e) => new IfStore(e));
        this.use((e) => new multis.Container(e));
    }

    onStep(state) {
        const store = this.store;
        if (store === null)
            return ;
        
        // freeze the current state
        state.freeze();
        store.store(state);
    }
}

multis.ops.op('o', new IfOp())
    .mod('+', (m) => {})
    .mod('%', (m, op) => {
        // % is like a operator --> can be used as operator
        op.on('step', (args, event) => {
            let state = args[0];
            
            if ("data" in event) {
                if (event.data !== null) {
                    const data = event.data;
                    
                    data.each((state) => state.unfreeze());
                    data.empty();
                }
            }
        });

    }, true)
    .mod('=', (m) => {})
    .mod('s', (m) => {
        // allow multiples 
        if ("data" in m) {
            if (m.data !== null) {
                const data = m.data;

                data.suppress();
            }
        }
    })
    .req([ '+', '%', '=' ]);