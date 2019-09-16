if (typeof multis === "undefined") multis = {};

(function(obj) {
    // let defaults = "[{\"x\":1,\"y\":1,\"op\":\"x\"},{\"x\":2,\"y\":1,\"op\":\">\"}]";
    let defaults = "[{\"x\":1,\"y\":1,\"op\":\"x\"},{\"x\":2,\"y\":1,\"op\":\">\"},{\"x\":6,\"y\":1,\"op\":\"v\"},{\"x\":5,\"y\":4,\"op\":\"~\"},{\"x\":2,\"y\":5,\"op\":\"^\"},{\"x\":5,\"y\":5,\"op\":\"v\"},{\"x\":6,\"y\":5,\"op\":\"<\"},{\"x\":5,\"y\":9,\"op\":\"x\"},{\"x\":5,\"y\":10,\"op\":\"!\"}]";

    class Universe {
        constructor(interpreter) {
            this.interpreter = interpreter;
            this.interpreter.parent = this;

            this.width = null;
            this.height = null;
            this.cells = null;

            this.reset(20, 20);
        }

        reset(width, height) {
            this.width = width;
            this.height = height;

            this.cells = new Array();
            for(let y = 0; y < this.height; y++) {
                this.cells[y] = [];
                for(let x = 0; x < this.width; x++) {
                    this.cells[y][x] = null;
                }
            }

            this.interpreter.reset();
            // add defaults
            if (defaults !== undefined)
                this.json(defaults);
        }

        set(x, y, op) {
            if(op !== undefined)
                this.cells[y][x] = op;
        }

        json(input) {
            if (input === undefined) {
                // save
                let arr = [];
                for(let y = 0; y < this.height; y++) {
                    for(let x = 0; x < this.width; x++) {
                        if (this.cells[y][x] !== null) {
                            arr.push({
                                'x': x,
                                'y': y,

                                // operator code
                                'op': this.cells[y][x]
                            });
                        }
                    }
                }
                
                return arr;
            }

            // parse string to json object
            if (typeof input === "string") input = JSON.parse(input);
            for(let i = 0; i < input.length; i++) {
                const block = input[i];

                // this is a block
                if ("x" in block && "y" in block) {
                    this.set(block.x, block.y, block.op);
                    // continue for with loop
                    continue;
                }
                else {

                }

                // TODO: throw error ... maleformed file format
                editor.stdout.throw(new Error('position out of bounds'));
            }
        }
    }

    obj.Universe = Universe;
})(multis);