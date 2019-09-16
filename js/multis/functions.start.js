class StartingPoint extends multis.Event {
    constructor() {
        super();
    }

    start(interp, pos) {
        // interp.value(pos.x, pos.y);
        
        // default:
        interp.value(pos.x, pos.y, 1, 0);
    }
}
multis.ops.op('x', new StartingPoint());