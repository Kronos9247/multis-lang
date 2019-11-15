if (typeof editor === "undefined") editor = {};

(function(obj) {
    var _Object;

    class Prefab {
        constructor(name, width, height, content) {
            this.name = name;
            this.width = width;
            this.height = height;
            this.content = content;
        }

        instantiate() {
            return new _Object(this.name, this.width, this.height, Array.from(this.content));
        }
    }

    class Object extends Prefab {
        rotate() {

        }
    }
    _Object = Object;


    obj.Prefab = Prefab;
    obj.prefabs = [];
    (function(Prefab, prefabs, donefn) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                const json = JSON.parse(this.responseText);
                
                for (let key in json) {
                    const data = json[key];
                    
                    var size = data.size.split("x");
                    let width = Number(size[0]);
                    let height = Number(size[1]);
                    let prefab = new Prefab(data.name, width, height, data.prefab);
                    
                    prefabs.push(prefab);
                }

                donefn();
            }

            if (this.status >= 400) {
                donefn(new Error("something went wrong during the download of the prefabs!"));
            }
        };

        xhttp.open("GET", "examples/prefabs.json", true);
        xhttp.send();
    })(Prefab, obj.prefabs, (err) => {
        if (err) {
            editor.stdout.throw(err);

            return;
        }


        for (let i = 0; i < obj.prefabs.length; i++) {
            const prefab = obj.prefabs[i];

            let element = $(`<li><a href="#">${prefab.name}</a></li>`);
            element.click((e) => {
                e.preventDefault();

                selector.swap (prefab);
                // change selector
                console.log(`selected ${prefab.name} as prefab!`);
            });

            $("#prefabs-container").append(element);
        }

        // const parent = document.getElementById("multis-prefab");

        // for (let i = 0; i < obj.prefabs.length; i++) {
        //     const prefab = obj.prefabs[i];
        //     let schema = prefab.content;

        //     new p5((sketch) => {
        //         var xs;
        //         var ys;

        //         sketch.setup = function() {
        //             sketch.createCanvas(64, 64);
        //             sketch.noLoop();

        //             var mv = max(prefab.width, prefab.height)
        //             xs = 64 / mv;
        //             ys = 64 / mv;
        //         }

        //         sketch.draw = function() {
        //             sketch.background(51);
        //             console.log("hi");
                    
        //             for (let j = 0; j < schema.length; j++) {
        //                 const x = schema[j]["x"];
        //                 const y = schema[j]["y"];

        //                 sketch.stroke(255);
        //                 sketch.fill(255);
        //                 sketch.textSize(22);
        //                 sketch.text(schema[j]["op"], x * xs + xs / 2, y * ys + ys / 2);
        //             }
        //         }
        //     }, parent);
        // }

        function clamp(x, min, max) {
            if(x < min) return min;
            if(x > max) return max;
            return x;
        }

        class PrefabSelector extends obj.Selector {
            constructor(canvas, prefab) {
                super();

                this.setup();
                this.opindex = 0;

                this.prefab = prefab;
                if (prefab === undefined)
                    this.prefab = obj.prefabs[0];

                // used for painting the ops to a image
                this.canvas = new editor.Canvas(this.draw_fn(), canvas);
            }

            draw_fn() {
                const selector = this;

                return function() {
                    const prefab = selector.prefab;
                    // let xs = floor(this.width / store.width);
                    // let ys = floor(this.height / store.height);
                    let xs = this.width / store.width;
                    let ys = this.height / store.height;

                    this.clear();
                    this.textSize(40 * (this.width / 800));
                    this.stroke(255);
                    
                    for (let key in prefab.content) {
                        const op = prefab.content[key];

                        this.text(op["op"], op["x"] * xs + xs / 4, op["y"] * ys + ys*(3/4));
                    }
                };
            }
    
            draw() {
                let xs = floor(width / store.width);
                let ys = floor(height / store.height);
                let x = floor(mouseX / width * store.width);
                let y = floor(mouseY / height * store.height);

                x = clamp(x + this.prefab.width, this.prefab.width, store.width) - this.prefab.width;
                y = clamp(y + this.prefab.height, this.prefab.height, store.height) - this.prefab.height;
    
                if(!this.deletemode)
                    fill(0, 0, 0, 100);
                else
                    fill(200, 100, 100, 100);
                    
                this.canvas.draw(x * xs, y * ys);
                stroke(0);
                rect(x * xs, y * ys, xs * this.prefab.width, ys * this.prefab.height);
            }
    
            keyPressed(code) {

            }
    
            // mousePressed(mouseButton) {
            //     if (mouseButton == RIGHT) 
            //         this.deletemode = !this.deletemode;
            // }
    
            
            getAction() {
                return this.prefab.content;
            }

            action(store, x, y) {
                const prefab = this.getAction();

                for (let key in prefab) {
                    const op = prefab[key];
                    
                    store.set(x + op["x"], y + op["y"], op["op"]);
                }
            }

            swap(prefab) {
                this.prefab = prefab;
                this.canvas.repaint();
            }
        }

        obj.PrefabSelector = PrefabSelector;
    });
})(editor);