if (typeof multis === "undefined") multis = {};

(function(obj) {
    class Events {
        constructor() {
            this.mods = []; // applied modifiers

            // TODO: add event dispatching for each indevidual cell
            this.events = {};
        }

        reset() {
            this.mods = [];
            this.events = {};

        }

        used() {
            if (this.mods.length == 0) {
                let keys = Object.keys(this.events);

                if (keys.length == 0) {
                    return false;
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
    }

    obj.Events = Events;
})(multis);