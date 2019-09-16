if (typeof multis === "undefined") multis = {};

(function(obj) {
    class State {
        constructor(pos, vel, universe, value) {
            this.value = value;
            if (value === undefined)
                this.value = 255;

            this.position = pos;
            this.velocity = vel;
            this.preVel = vel;

            this.universe = universe;
        }

        vel(velocity) {
            if (velocity !== undefined || velocity !== null) {
                this.preVel = this.velocity;
                this.velocity = velocity.normalize();
            }
        }

        apply() {
            // TODO: get operator at current position and apply action
            // to the current state

            if(this.position.x >= 0 && this.position.x < this.universe.width) {
                if(this.position.y >= 0 && this.position.y < this.universe.height) {
                    const opcode = this.universe.cells[this.position.y][this.position.x];
                    if(opcode in multis.ops) {
                        multis.ops[opcode].step(this);
                    }

                    return;
                }    
            }

            // TODO: call error dispatcher ... out of bounds
        }

        update() {
            this.apply();

            this.position.add(this.velocity);
        }
    }

    class Interpreter {
        constructor() {
            this.states = null;
            this.parent = null;

            this.reset();
        }

        init() {
            const store = this.parent;

            for(let y = 0; y < store.height; y++) {
                for(let x = 0; x < store.height; x++) {
                    const cell = store.cells[y][x];

                    if(cell in multis.ops) {
                        multis.ops[cell].start(this, { 'x': x, 'y': y });
                    }
                }
            }
        }

        reset() {
            this.initState = true;
            this.states = [];

            // TEST:
            // TODO: add universe to state -> get op at position
            // this.states.push(new State(new p5.Vector(1, 1), new p5.Vector(1, 0), 10));

            // TODO: find spawn locations and spawn states
            // apply <function> to state at the positon
        }

        value(x, y, velx, vely) {
            if(velx === undefined) velx = 0;
            if(vely === undefined) vely = 0;
            
            const state = new State(new p5.Vector(x, y), new p5.Vector(velx, vely), this.parent);
            this.states.push(state);
            return state;
        }

        step() {
            this.states.forEach(state => state.update());
        }
    }

    obj.Interpreter = Interpreter;
})(multis);