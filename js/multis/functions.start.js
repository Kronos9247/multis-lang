if (typeof multis === "undefined") multis = {};

class StartingPoint extends multis.Event {
    constructor() {
        super();
    }

    onStart(interp, pos) {
        // default:
        interp.value(pos.x, pos.y, 1, 0);
    }
}

multis.ops.op('x', new StartingPoint())
    .mod('!', (m) => {
        // cancel start event
        m.on('start', (args) => false);
        m.on('step', (args) => {
            let state = args[0];
            let interp = state.parent;

            let index = interp.states.indexOf(state);
            if (index >= 0)
                interp.states = interp.states.splice(index, 1);

            return false;
        });
    });