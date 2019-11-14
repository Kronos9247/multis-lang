if (typeof editor === "undefined") editor = {};

(function(obj) {
    class Debugger {
        constructor(interpreter) {
            this.interpreter = interpreter;
        }

        draw() {
            let xs = floor(width / store.width);
            let ys = floor(height / store.height);

            colorMode(HSB);

            var states = this.interpreter.states;
            for (let i = 0; i < states.length; i++) {
                const state = states[i];
                let pos = state.position;
                let colour = color(state.value % 255, 255, 255, 50);

                push();
                fill(colour);
                stroke(colour);
                
                translate(pos.x * xs + xs / 2, pos.y * ys + ys / 2);
                rotate(atan2(state.velocity.y, state.velocity.x));
                text(">", 0, 0);
                pop();
            }

            colorMode(RGB);
        }
    }

    obj.Debugger = Debugger;


    // this helps me as the developer of multis to speed up the development
    class Inspector {
        constructor(debuger) {
            this.debuger = debuger;
            this.interpreter = this.debuger.interpreter;
            this.universe = this.interpreter.parent;
        }

        draw() {
            this.hover();
        }

        hover() {
            let x = floor(mouseX / this.universe.width);
            let y = floor(mouseY / this.universe.height);
            let w = width / this.universe.width;
            let h = height / this.universe.height;


            // shouldnt be activated --> causes massive lags
            const key = this.universe.width * y + x;
            if (!(key in this.interpreter.ops))
                this.light_neighbors(x, y,  w, h);


            noFill();
            stroke(255, 0, 0);
            rect(x * w, y * h, w, h);

            stroke(255, 0, 0); fill(255, 0, 0);
            text(this.hover_info(x, y), x * w + w / 2, y * h - h / 2);
        }

        hover_info(x, y) {
            const key = this.universe.width * y + x;
            let events = this.interpreter.events[key];

            let ops = null;
            if (key in this.interpreter.ops) {
                ops = this.interpreter.ops[key];
            }

            var stack = [
                events !== undefined ? 'e' : '',
                ops !== null ? 'f' : ''
            ]
            return stack.join("");
        }

        light_neighbors(x, y,  w, h) {
            const key = this.universe.width * y + x;
            if (!(key in this.interpreter.imods)) return ;

            let mods = this.interpreter.imods[key];
            for (let i = 0; i < mods.length; i++) {
                const pos = mods[i];

                this.light_neighbor(pos.x, pos.y,  w, h);
            }
        }

        light_neighbor(x, y,  w, h) {
            const key = this.universe.width * y + x;
            if (key in this.interpreter.ops)
                stroke(150, 150, 0);
            else
                stroke(150, 0, 0);

            noFill();
            rect(x * w, y * h, w, h);
        }
    }

    obj.attach = function (debuger, interp) {
        let patch = function(obj, name) {
            if (name in obj)
                return obj[name].bind(obj);
        };
        
        const debug = new Inspector(debuger);
        let routine = patch(debuger, "draw");
        let draw = patch(debug, "draw");

        // real patch stuff happens here
        debuger.draw = () => {
            routine();
            // draw();

        };

        if (interp !== undefined) {
            interp.inspection();
        }
        return debug;
    };
})(editor);
