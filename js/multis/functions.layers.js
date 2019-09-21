if (typeof multis === "undefined") multis = {};

(function(obj) {
    class Events {
        constructor() {
            this.mods = []; // applied modifiers
            this.events = {};
            this.ops = {};

            this.data = null; // Stored: container
        }

        reset() {
            this.mods = [];
            this.events = {};
            this.ops = {};
            
            this.data = null;
        }


        use(data) {
            if (data instanceof obj.Container) {
                if (this.data === null) {
                    this.data = data;
                }
            }
        }

        used() {
            if (this.data === null) {
                if (this.mods.length == 0) {
                    let keys = Object.keys(this.events);

                    if (keys.length == 0) {
                        return false;
                    }
                }
            }
            return true;
        }

        emit(name, args) {
            if (name in this.events) {
                let events = this.events[name];

                if (typeof events === "function") {
                    let value = events(args);

                    if (value !== undefined)
                        return value;
                    else 
                        return true;
                }
                else {
                    for (let i = 0; i < events.length; i++) {
                        const event = events[i](args);

                        if (event === false)
                            return false;
                    }

                }
            }

            return true;
        }

        on(name, event) {
            if (name in this.events) {
                let events = this.events[name];

                if (typeof events === "function") {
                    // events is a function
                    this.events[name] = [ events, event ];
                }
                else {
                    events.push(event);
                }
            }
            else 
                this.events[name] = event;
        }

        opt(xy, operator) {
            if (!(xy in this.ops)) {
                this.ops[xy] = operator;
            }
        }
    }

    obj.Events = Events;
})(multis);