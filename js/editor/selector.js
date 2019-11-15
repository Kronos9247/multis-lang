if (typeof editor === "undefined") editor = {};

(function(obj) {
    const ops = [ 'x', [ '>', 'v', '<', '^' ], 'o', '%', [ '~', '!', '+', '-', '@', '/', '|', 's' ] ];

    class Selector {
        constructor() {
            this.setup();
            this.opindex = 0;
            this.rotation = 0;
        }

        setup() {
            textSize(40 * (width / 800)); // default: 60
        }

        draw() {
            let xs = floor(width / store.width);
            let ys = floor(height / store.height);
            let x = floor(mouseX / width * store.width) * xs;
            let y = floor(mouseY / height * store.height) * ys;

            if(!this.deletemode)
                fill(0, 0, 0, 100);
            else
                fill(200, 100, 100, 100);
            stroke(0);
            rect(x, y, xs, ys);

            if(!this.deletemode) {
                stroke(255);
                let opcode = ops[this.opindex];
                if (typeof opcode === "object")
                    opcode = opcode[this.rotation];
                
                text(opcode, x + xs / 2, y + ys / 2);
            }
        }

        keyPressed(code) {
            if (code == LEFT_ARROW) {
                this.opindex -= 1;
                if(this.opindex < 0) 
                    this.opindex = 0;
            }
            else if (code == RIGHT_ARROW) {
                this.opindex += 1;
                if(this.opindex >= ops.length) 
                    this.opindex = ops.length - 1;
            }

            
            /* Handle ops rotation */
            if (code == LEFT_ARROW || code == RIGHT_ARROW) {
                this.rotation = 0;
            }
            let opcode = ops[this.opindex];
            if(typeof opcode === "object") {
                if (code == UP_ARROW) {
                    this.rotation -= 1;
                    if(this.rotation < 0)
                        this.rotation = opcode.length - 1;
                }
                else if (code == DOWN_ARROW) {
                    this.rotation = (this.rotation + 1) % opcode.length;
                }
            }
        }

        mousePressed(mouseButton) {
            if (mouseButton == RIGHT) 
                this.deletemode = !this.deletemode;
        }

        
        getAction() {
            if(this.deletemode)
                return null;

            let opcode = ops[this.opindex];
            if (typeof opcode === "object")
                opcode = opcode[this.rotation];

            return opcode;
        }

        action(store, x, y) {
            store.set(x, y, this.getAction());
        }
    }

    obj.Selector = Selector;
})(editor);
