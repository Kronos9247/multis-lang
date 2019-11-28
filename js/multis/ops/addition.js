if (typeof multis === "undefined") multis = {};

class MathContainer extends multis.Container {
    constructor(parent) {
        super(parent);

        this.state = [];
    }

    store(state) {
        this.state.push(state);
    }

    empty() {
        this.state = [];
    }
}

class MathOp extends multis.Event {
    constructor() {
        super();

        this.use((e) => new MathContainer(e));
    }
    
    onStep(state) {
        const store = this.store;
        if (store === null)
            return ;
        
        if (store.state === undefined || store.state === null) {
            if (this.suppress) {
                state.value = 0;
            }
        }
        else if (Array.isArray(store.state)) {
            let states   = store.state.map((v) => v.value());
            
            if (states.length > 0) {
                state.value += states.reduce((preValue, curValue) => preValue + curValue);
            }
            else {
                if (this.suppress) {
                    state.value = 0;
                }
            }
        }
        else {
            state.value += store.state.value();
        }

        store.each((state) => state.state.unfreeze());
        store.empty();
    }
}



class MathAdd {
    constructor(state) {
        this.state = state;
    }

    value() {
        // this.state.destroy();
        return this.state.value;
    }
}

class MathSub {
    constructor(state) {
        this.state = state;
    }

    value() {
        this.state.destroy();
        return -this.state.value;
    }
}


function math(operator) {
    return (args, event) => {
        let state = args[0];
            
        if (event === null)
            return ;
        if (event.data === null)
            return ;
        
        // freeze the current state
        state.freeze();
        event.data.store(new operator(state));
    }
}

// multis.ops.op('=')
multis.ops.op("=", new MathOp())
    .mod("+", (m, op) => op.on('step', math(MathAdd)), true)
    .mod("-", (m, op) => op.on('step', math(MathSub)), true)
    .mod("s", (m) => {
        // allow multiples 
        if ("data" in m) {
            if (m.data !== null) {
                const data = m.data;

                data.suppress = true;
            }
        }
    })

    .req([ '+', '-' ]);