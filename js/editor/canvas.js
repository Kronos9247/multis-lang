if (typeof editor === "undefined") editor = {};

(function(obj) {
    class Canvas {
        constructor(onpaint, width, height, canvas, init) {
            if (canvas === undefined && init === undefined) {
                canvas = width;
                init = height;

                width = canvas.width;
                height = canvas.height;
            }

            this.p5 = new p5(function(p) {
                p.setup = function() {
                    p.createCanvas(width, height);
                    p.noLoop();

                    if(typeof init === "function")
                        init.bind(p)();
                };
    
                p.draw = onpaint.bind(p);
            });
            this.canvas = canvas;
            this.onpaint = onpaint;

            this.width = width;
            this.height = height;
        }
    
        repaint() {
            this.p5.draw();
        }
    
        draw() {
            var ctx = this.canvas.drawingContext;
            ctx.drawImage(this.p5.canvas, 0, 0, this.width, this.height);
        }
    }

    obj.Canvas = Canvas;
})(editor);
