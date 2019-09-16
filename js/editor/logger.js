if (typeof editor === "undefined") editor = {};

(function(obj) {
    class Logger {
        constructor(query) {
            // TODO: use jQuery maby, to query the html element
        }

        clear() {
            // TODO: implement clear
        }

        print() {
            let args = arguments;

            for(let i = 0; i < args.length; i+=2) {
                const message = args[i];
                const colour = args[i + 1];

                // TODO: print
            }
        }

        throw(error) {
            this.print(error.message, { 'r': 255, 'g': 0, 'b': 0 });
        }
    }

    obj.Logger = Logger;
    obj.stdout = new Logger("#editor-log"); // this is the default logger
})(editor);