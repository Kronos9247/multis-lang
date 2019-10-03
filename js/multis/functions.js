if (typeof multis === "undefined") multis = {};

(function(obj) {
    let ops = {};
    function op(opname, callback) {
        if (typeof callback === "function")
            this[opname] = new obj.Event(callback);
        
        else this[opname] = callback;

        // return Event interface at the end
        return this[opname];
    }
    ops.op = op.bind(ops);

    class BaseEvent {
        // Event interface definition

        start(interp, pos) {}
        step(state) {}
        end() {}
    }

    class Event extends BaseEvent {
        constructor(cb) {
            super();
            if (cb !== undefined)
                this.onStep = cb.bind(this);

            this.modifiers = {};
            this.requirements = [];
            this.storage = null;
            this.events = null;
        }

        wrap(events, context) {
            if (context !== undefined) {
                this.events = events;
                
                context(this);

                this.events = null;
            }
        }


        start(interp, pos) {
            // cancel emit if events is null
            if (this.events === null) {
                if ("onStart" in this) this.onStart(interp, pos);

                return; // function defaultly returns undefined
            }


            // const key = pos.x + pos.y * interp.parent.width;
            // let mods = [];
            // if (key in this.mods)
            //     mods = this.mods[key];
            if (typeof this.storage === "function")
                this.events.data = this.storage(this, this.events);

            this.useModifiers(pos, interp, this.events.mods);
            for (let i = 0; i < this.events.mods.length; i++) {
                const modifier = this.events.mods[i];

                modifier.wrap(this.events, (mod) => mod.call());

                // this.events.wrap(modifier, (events) => {
                //     modifier.wrap(events, (mod) => mod.call());
                // });
            }

            let ops = Object.keys(this.events.ops);
            for (let i = 0; i < ops.length; i++) {
                const xy = ops[i];
                const fop = this.events.ops[xy];

                let y = floor(xy / interp.parent.width);
                let x = xy - y * interp.parent.width;

                fop.use(interp, {'x':x, 'y':y}, this.events);
            }

            // if (mods.length > 0)
            //     this.mods[key] = mods;

            // emit start
            if (this.events.emit('start', [ interp, pos ]))
                if ("onStart" in this) this.onStart(interp, pos);
        }
        step(state) {
            // cancel emit if events is null
            if (this.events === null) {
                if ("onStep" in this) this.onStep(state);

                return; // function defaultly returns undefined
            }
            
            // emit step
            if (this.events.emit('step', [ state ]))
                if ("onStep" in this) this.onStep(state);
        }
        end() {
            // cancel emit if events is null
            if (this.events !== null) {
                // emit end
                this.events.emit('end', []);
                if ("onEnd" in this) this.onEnd();
            }
            else {
                if ("onEnd" in this) this.onEnd();
            }
            
            // clear applied modifiers list
            this.mods = {};
        }
        

        useModifiers(pos, interp, mods) {
            this.modifier(pos.x + 1, pos.y, interp, mods);
            this.modifier(pos.x - 1, pos.y, interp, mods);
            this.modifier(pos.x, pos.y + 1, interp, mods);
            this.modifier(pos.x, pos.y - 1, interp, mods);

        }

        modifier(x, y, interp, mods) {
            const universe = interp.parent;
            const cells = universe.cells;

            if (x >= 0 && x < universe.width) {
                if (y >= 0 && y < universe.height) {
                    let opcode = cells[y][x];

                    if (opcode in this.modifiers) {
                        const store = this.modifiers[opcode];

                        // this should only be called once and not multiple times!!!
                        let mod = mods.find((mod) => mod == store);
                        if (mod === undefined) {
                            if (store.operator !== null) {
                                this.events.opt(x + y * universe.width, store.operator);
                            }

                            mods.push(store);
                        }
                    }
                }
            }
        }

        mod(opcode, modifier, fakeop) {
            if (typeof modifier !== "object")
                modifier = new obj.Modifier(modifier);

            if (opcode in this.modifiers) {
                const oldm = this.modifiers[opcode];

                // wrapping the current and the old modifier inside of the wrapper modifier!
                this.modifiers[opcode] = new obj.Modifier.Wrapper(oldm, modifier);
            }
            else
                this.modifiers[opcode] = modifier;

            
            // if this is a fake op
            if (fakeop) 
                this.modifiers[opcode].fakes();

            return this;
        }

        req(requires) {
            this.requirements.push(requires);

            return this;
        }

        use(cb) {
            // generator callback cb(Event, Events);
            if (typeof cb === "function") {
                if (this.storage === null) {
                    this.storage = cb;
                }
            }
        }


        get stores() {
            // if function has requirements it always needs to have a Events object bound to it
            if (this.requirements.length > 0) return true;
            // this method returns true if this operator requires a event class or not
            return Object.keys(this.modifiers).length > 0 || typeof this.storage === "function";
        }

        get store() {
            if (this.events === null) 
                return null;

            return this.events.data;
        }
    }
    obj.Event = Event;
    obj.Event.Base = BaseEvent;

    // (function(op) {
    //     ops.op('>', (state) => state.vel(new p5.Vector(1, 0)));
    //     ops.op('^', (state) => state.vel(new p5.Vector(0, -1)));
    //     ops.op('v', (state) => state.vel(new p5.Vector(0, 1)));
    //     ops.op('<', (state) => state.vel(new p5.Vector(-1, 0)));

    //     // ops.op('x', (state) => state.vel(new p5.Vector(1, 0)));
    // })(ops);
    obj.ops = ops; // DO NOT REMOVE THIS LINE !!!
})(multis);