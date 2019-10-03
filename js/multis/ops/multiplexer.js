if (typeof multis === "undefined") multis = {};

class MuxContainer extends multis.Container {
    constructor(parent) {
        super(parent);

        this.a = null;
        this.b = null;
    }
}

// TODO: allow fake ops to override already existing ones --> fake ops are prioritiest
// TODO: allow stacking by states on the % when a "s" is placed near the % ... fake op --> can have a events object with all the data associated with

// TODO: position the state at the correct output
// TODO: if state steps over % it will stay until something has move over the o, |
//       if nothing is on the % it will be outputed by the | else the o
// TODO: if no o exists state will be deleted automaticaly --> o is not a requirment
class MuxOp extends multis.Event {
    constructor() {
        super();

        this.use((e) => new MuxContainer(e));
        // this.use((e) => new multis.Container(e));
    }

    onStart(interp, pos) {
        const store = this.store;
        if (store === null)
            return ;

        store.b = pos;
    }

    onStep(state) {
        const store = this.store;
        if (store === null)
            return ;

        let target = store.state;
        if (Array.isArray(target)) {
            if (target.length > 0) target = true;
        }
        else {
            if (state !== undefined) target = true;
        }


        if (target) {
            state.teleport(store.a);
        }
        else {
            state.teleport(store.b);
        }

        store.each((state) => state.unfreeze());
        store.empty();
    }
}

// TODO: just store & freeze states that move over %
// TODO: teleport states
// TODO: do not create events, if special / fakeop is used
//       >> in the case of double defined operator (normal + special) and normal op creates events object
multis.ops.op('|', new MuxOp())
    .mod('%', (m, op) => {
        op.on('step', (args, event) => {
            let state = args[0];
            
            if (event === null)
                return ;
            if (event.data === null)
                return ;
            
            // freeze the current state
            state.freeze();
            event.data.store(state);
        });

    }, true)
    .mod('o', (m, op) => {
        op.on('start', (args, event) => {
            if (event === null)
                return ;
            if (event.data === null)
                return ;

            let data = event.data;
            data.a = args[1];
        });

        op.on('step', (args, event) => {
            let state = args[0];
            
            if (event === null)
                return ;
            if (event.data === null)
                return ;

            let data = event.data;
            let target = data.state;
            if (Array.isArray(target)) {
                if (target.length > 0) target = true;
            }
            else {
                if (state !== undefined) target = true;
            }


            console.log(data);
            if (target) {
                state.teleport(data.a);
            }
            else {
                state.teleport(data.b);
            }

            data.each((state) => state.unfreeze());
            data.empty();
        });
    }, true)
    .mod('s', (m) => {
        if (m.data === null)
            return ;

        m.data.suppress();
    })
    .req('%')
    .req('o');