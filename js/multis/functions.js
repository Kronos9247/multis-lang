if (typeof multis === "undefined") multis = {};

(function(obj) {
    let ops = {};
    function op(opname, callback) {
        if (typeof callback === "function")
            this[opname] = new obj.Event(callback);
        
        else this[opname] = callback;
    }
    ops.op = op.bind(ops);

    class Event {
        constructor(cb) {
            if (cb !== undefined)
                this.step = cb.bind(this);
        }

        start(interp, pos) {}
        step(state) {}
        end() {}
    }
    obj.Event = Event;

    (function(op) {
        ops.op('>', (state) => state.vel(new p5.Vector(1, 0)));
        ops.op('^', (state) => state.vel(new p5.Vector(0, -1)));
        ops.op('v', (state) => state.vel(new p5.Vector(0, 1)));
        ops.op('<', (state) => state.vel(new p5.Vector(-1, 0)));

        // ops.op('x', (state) => state.vel(new p5.Vector(1, 0)));
    })(ops);
    obj.ops = ops;
})(multis);