if (typeof multis === "undefined") multis = {};

(function(obj) {
    class Modifier {
        // Modifier interface definition

        constructor(cb) {
            this.callback = cb.bind(this);
            this.events = null;
        }

        wrap(events, context) {
            if (context !== undefined) {
                this.events = events;
                
                context(this);

                this.events = null;
            }
        }

        call() {
            if (this.events !== null)
                this.callback(this.events);
        }

        step(state) {};
    }

    obj.Modifier = Modifier;

    /* wrapping the current state inside of the wrapper state */
    class ModifierWrapper extends Modifier {
        // old modifier, new modifier
        constructor(oldm, newm) {
            this.old_mod = oldm;
            this.new_mod = newm;

            this.bounds = {}
            this.bind("step");
        }

        bind(func) {
            this.bounds[func] = this.old_mod[func].bind(this.old_mod);
        }

        // do not call: oldm.test(<var>, <var>) 
        // call: newm.test(<var>, <var>, <function-old>)
        step(state) {
            this.new_mod.step(state, this.bounds.step);
        }
    }
    obj.Modifier.Wrapper = ModifierWrapper;
})(multis);