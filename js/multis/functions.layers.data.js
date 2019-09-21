if (typeof multis === "undefined") multis = {};

(function(obj) {
    class ContainerBase {
        constructor(parent) {
            this.parent = parent;
        }
    }

    class Container extends ContainerBase {
        constructor(parent) {
            super(parent);

            this.state = null;
            this.suppress = false;
        }

        suppress() {
            this.suppress = true;
        }
    
        store(state) {
            if (!this.suppress) {
                if (this.state !== null) {
                    state.destroy();
    
                    editor.stdout.throw(new Error("multiple states on the same operand"));
                }
                else 
                    this.state = state;
            }
            else {
                if (this.state === null)
                    this.state = [];
    
                let findstate = this.state.find((v) => v == state);
                if (findstate === null)
                    this.state.push(state);
            }
        }

        each(cb) {
            // I dont like to handle multiple states, so simply create a each method for that
            if (this.state === null)
                return ;
    
            if (Array.isArray(this.state)) {
                for (let i = 0; i < this.state.length; i++) {
                    cb(this.state[i]);
                }
            }
            else {
                cb(this.state);
            }
        }
    
        empty() {
            this.state = null;
        }
    }

    obj.Container = Container;
    obj.Container.Base = ContainerBase;
})(multis);