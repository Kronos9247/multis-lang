/* MultisBlocks Stuff */
var interp = new multis.Interpreter();
var store = new multis.Universe(interp);
/* Editor Stuff */
var canvas = null;
var selector = null;
let execmode = false;

function setup() {
    let cns = createCanvas(400, 400);
    cns.parent('editor');
    
    textAlign(CENTER, CENTER);

    /* Editor Stuff */
    // canvas = new editor.Canvas(paint, 400, 400, cns, icanvas);
    canvas = new editor.Canvas(paint, cns, icanvas);
    // selector = new editor.PrefabSelector(cns, editor.prefabs[2]); // new editor.Selector();
	selector = new editor.Selector();
    debuger = new editor.Debugger(interp); // I know that debugger is written with a double g 
    editor.attach(debuger, interp); // attaching a debug render to the already existing debugger
}
// TEST: -> TODO: add when in debug mode
// interv = setInterval(() => interp.step(), 500);


function draw() {
    background(43, 47, 51);
    canvas.draw();

    if (execmode)
        debuger.draw();
    else
        selector.draw();
    
    // // TEST:
    // debuger.draw();

    // // debuger.draw();
    // selector.draw();
}

/* editor canvas */
function icanvas() {
    this.textAlign(CENTER, CENTER);

    this.textSize(40 * (this.width / 800)); // auto-compute the size of the glyphs
    this.stroke(255);
    this.fill(255);
}

function paint() {
    this.background(43, 47, 51);

    let xs = floor(width / store.width);
    let ys = floor(height / store.height);
    for(let y = 0; y < store.height; y++) {
        for(let x = 0; x < store.height; x++) {
            let cell = store.cells[y][x];
            if (cell !== null) {
                this.text(cell, x * xs + xs / 2, y * ys + ys / 2);
            }
        }
    }
}
/* editor canvas - end */

let init = false;
function keyPressed() {
    if (!execmode)
        selector.keyPressed(keyCode);

    // if (key == 'w') {        
    //     interp.init();
    // }
}

function mousePressed() {
    if (execmode)
        return ;


    selector.mousePressed(mouseButton);

    // get selector action
    let x = floor(mouseX / width * store.width);
    let y = floor(mouseY / height * store.height);
    
    // store.set(x, y, selector.getAction());
    selector.action(store, x, y);

    // "fb" canvas needs to be repainted
    canvas.repaint();
}

function mouseReleased() {
    selector.deletemode = false;
}

function mouseDragged() {
    if (execmode)
        return ;

    if (mouseButton != LEFT) { 
        // get selector action
        let x = floor(mouseX / width * store.width);
        let y = floor(mouseY / height * store.height);
        
        store.set(x, y, selector.getAction());

        // "fb" canvas needs to be repainted
        canvas.repaint();
    }
}


function windowResized() {
    draw();
    canvas.repaint();
    // resizeCanvas(windowWidth, windowHeight);
}