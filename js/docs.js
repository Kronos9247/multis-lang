class MultisCanvas {
    constructor(program, container) {
        this.program = program;

        this.context = new p5(this.load.bind(this), $(container).get(0));
    }

    load(pjs) {
        const setup = this.setup.bind(this);
        const draw = this.draw.bind(this);
        

        pjs.setup = () => setup(pjs);
        pjs.draw = () => draw(pjs);
    }


    setup(pjs) {
        let cns = pjs.createCanvas(100, 100);
    }

    draw(pjs) {
        pjs.background(255);
    }
}