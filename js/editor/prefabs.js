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
            multis.editor.stdout.throw(err);

            return;
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
    });
})(editor);