if (typeof multis === "undefined") multis = {};

(function(obj) {
    function Merge(A, B) {
        class _A extends A {};
        class C extends _A {};

        const props = Object.getOwnPropertyNames(B.prototype);
        for (const prop of props) {
            C.prototype[prop] = B.prototype[prop];
        }

        return C;
    }

    class EvModifier extends Merge(obj.Event.Base, obj.Events) {
        constructor(modifier, sroot, stack) {
            super();
            this.modifier = modifier;

            this.sroot = sroot; // stack root element
            this.stack = stack; // parent stack element
        }

        start(interp, pos) {
            this.emit('start', [ interp, pos ]);
        }
        step(state) {
            this.emit('step', [ state ]);
        }
        end() {
            this.emit('end', []);
        }

        on(name, event) {}
        emit(name, args) {
            if (this.modifier === null) {
                return true;
            }

            if (name in this.modifier.event) {
                let events = this.modifier.event[name];

                if (typeof events === "function") {
                    let value = events(args, this.sroot);

                    if (value !== undefined)
                        return value;
                    else 
                        return true;
                }
                else {
                    for (let i = 0; i < events.length; i++) {
                        const event = events[i](args, this.sroot);

                        if (event === false)
                            return false;
                    }

                }
            }

            return true;
        }
    }
    

    class OpModifier extends obj.Modifier {
        constructor() {
            super(function(){});

            this.event = {};
        }

        on(name, event) {
            this.event[name] = event;
        }

        use(interp, pos, events) {
            interp.regs(pos, obj.stack(this, events));
        }

        // emit(name, args) {
        //     if (name in this.event) {
        //         const event = this.event[name];

        //         if (typeof event === "function") {
        //             event(args);
        //         }
        //     }

        //     return true;
        // }
    }

    obj.Modifier.Operator = OpModifier;
    obj.stack = function (modifier, event) {
        if (modifier instanceof OpModifier) {
            return new EvModifier(modifier, event);
        }
    };
})(multis);