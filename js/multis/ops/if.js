if (typeof multis === "undefined") multis = {};

class IfStore extends multis.Container {
    constructor(parent) {
        super(parent);

        this.state = null;
        this.suppress = false;
    }

    suppress() {
        this.suppress = true;
    }

    store(state) {
        if (!this.suppress) {
            if (this.state !== null) {
                state.destroy();

                editor.stdout.throw(new Error("multiple states on the same operand"));
            }
            else 
                this.state = state;
        }
        else {
            if (this.state === null)
                this.state = [];

            let findstate = this.state.find((v) => v == state);
            if (findstate === null)
                this.state.push(state);
        }
    }

    each(cb) {
        // I dont like to handle multiple states, so simply create a each method for that
        if (this.state === null)
            return ;

        if (Array.isArray(this.state)) {
            for (let i = 0; i < this.state.length; i++) {
                cb(this.state[i]);
            }
        }
        else {
            cb(this.state);
        }
    }

    empty() {
        this.state = null;
    }
}

class IfOp extends multis.Event {
    constructor() {
        super();

        this.use((e) => new IfStore(e));
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