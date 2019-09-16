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
                
                // rotate(10);
                // translate(pos.x * xs, pos.y * ys);
                text(">", pos.x * xs + xs / 2, pos.y * ys + ys / 2);
                pop();
            }

            colorMode(RGB);
        }
    }

    obj.Debugger = Debugger;
})(editor);
