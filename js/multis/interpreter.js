if (typeof multis === "undefined") multis = {};

(function(obj) {
    class State {
        constructor(pos, vel, interp, value) {
            this.value = value;
            if (value === undefined)
                this.value = 255;

            this.position = pos;
            this.velocity = vel;
            this.preVel = vel;
            this.frozen = false;
            

            this.parent = interp;
            this.universe = interp.parent;
        }

        vel(velocity) {
            if (velocity !== undefined || velocity !== null) {
                this.preVel = this.velocity;
                this.velocity = velocity.normalize();
            }
        }

        teleport(position) {
            this.position.set(position.x, position.y);
        }

        freeze() {
            this.frozen = true;
        }

        unfreeze() {
            this.frozen = false;

            this.update(false);
        }

        destroy() {
            const states = this.parent.states;

            let index = states.indexOf(this);
            if (index >= 0)
                states.splice(index, 1);
        }

        unchecked_specific() {
                let fop = this.parent.specific(this.position);
                
                if (fop !== undefined) {
                    const key = this.position.x + this.position.y * this.universe.width;

                    let op = fop.modifier;
                    // if (key in this.parent.events)
                    if ("events" in fop)
                        // op.wrap(fop.events, (op) => op.step(this));
                        op.wrap(fop.sroot, (op) => op.step(this));
                    else
                        op.step(this);

                    return true;
                }

                return false;
        }

        apply_unchecked() {
            // TODO: get operator at current position and apply action
            // to the current state

            // specific first
            if (this.unchecked_specific()) {
                return ;
            }

            const opcode = this.universe.cells[this.position.y][this.position.x];
            if(opcode in multis.ops) {
                let ops = multis.ops[opcode];
                
                // if (Object.keys(modifiers).length > 0) {
                if (ops.stores) {
                    const key = this.position.x + this.position.y * this.universe.width;
                    
                    if (key in this.parent.events) {
                        ops.wrap(this.parent.events[key], (ops) => ops.step(this));

                        return;
                    }
                }

                ops.step.call(ops, this);
                // multis.ops[opcode].step(this);
            }
            // else if (opcode !== null) {
            //     let op = this.parent.specific(this.position);

            //     if (op !== undefined) {
            //         op.step(this);
            //     }
            // }

            return;
        }

        apply() {
            if(this.position.x >= 0 && this.position.x < this.universe.width) {
                if(this.position.y >= 0 && this.position.y < this.universe.height) {
                    this.apply_unchecked();

                    return;
                }
            }

            // TODO: call error dispatcher ... out of bounds
            editor.stdout.throw(new Error("state out of bounds"));
        }

        update(should_apply) {
            if (!this.frozen) {
                if (should_apply === undefined || should_apply === true)
                    this.apply();

                // stop position update
                if (this.frozen)
                    return;

                this.position.add(this.velocity);
            }
        }
    }

    class Interpreter {
        constructor() {
            this.states = null;
            this.events = null;
            this.ops = null;
            this.parent = null;
            
            this.reset();
        }

        reset() {
            this.initState = true;
            this.states = [];
            this.events = {};
            this.ops = {};

            // TEST:
            // TODO: add universe to state -> get op at position
            // this.states.push(new State(new p5.Vector(1, 1), new p5.Vector(1, 0), 10));

            // TODO: find spawn locations and spawn states
            // apply <function> to state at the positon
        }

        // initSpecifics() {
        //     let positions = Object.keys(this.ops);
        //     for (let i = 0; i < positions.length; i++) {
        //         const pos = positions[i];
        //         const fop = this.ops[pos];

        //         // x + y * width
        //         let y = floor(pos / this.parent.width);
        //         let x = pos - y * this.parent.width;
        //         let posn = { 'x': x, 'y': y };

        //         // let events = new obj.Events();
        //         fop.modifier.wrap(fop.events, (op) => op.start(this, posn));

        //         if (fop.events.used()) {
        //             // events = undefined;
        //             this.events[pos] = fop.events;
        //         }
        //         else {
        //             this.events[pos] = undefined;
        //         }
        //     }
        // }

        initCell(pos, ops, store) {
            const modifiers = ops.modifiers;

            // if (Object.keys(modifiers).length == 0) {
            if (!ops.stores) {
                ops.start(this, pos);

                return;
            }
            else {
                let events = new obj.Events();

                // wrap creates a new context with events set
                ops.wrap(events, (ops) => ops.start(this, pos));

                if (events.used()) {
                    const key = pos.x + pos.y * this.parent.width;

                    this.events[key] = events;
                    // TODO:
                    // events = new obj.Events();
                }
                else {
                    // TODO: 
                    // events.reset();
                }
            }
        }

        init() {
            const store = this.parent;

            for(let y = 0; y < store.height; y++) {
                for(let x = 0; x < store.height; x++) {
                    const cell = store.cells[y][x];

                    if(cell in obj.ops) {
                        this.initCell({ 'x': x, 'y': y }, obj.ops[cell], store);
                        // multis.ops[cell].start(this, { 'x': x, 'y': y });
                    }
                }
            }

            // this.initSpecifics();
        }

        specific(position) {
            const key = position.x + position.y * this.parent.width;

            if (key in this.ops) {
                return this.ops[key];
            }
        }

        regs(pos, op) {
            const key = pos.x + pos.y * this.parent.width;

            if (typeof this.ops[key] === "undefined") {
                this.ops[key] = op;
            }
        }

        value(x, y, velx, vely) {
            if(velx === undefined) velx = 0;
            if(vely === undefined) vely = 0;
            
            const state = new State(new p5.Vector(x, y), new p5.Vector(velx, vely), this);
            this.states.push(state);
            return state;
        }

        step() {
            this.states.forEach(state => state.update());
        }
    }

    obj.Interpreter = Interpreter;
})(multis);