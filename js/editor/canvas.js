if (typeof editor === "undefined") editor = {};

(function(obj) {
    class Canvas {
        constructor(onpaint, width, height, canvas, init) {
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
        }
    
        repaint() {
            this.p5.draw();
        }
    
        draw() {
            var ctx = this.canvas.drawingContext;
            ctx.drawImage(this.p5.canvas, 0, 0);
        }
    }

    obj.Canvas = Canvas;
})(editor);
