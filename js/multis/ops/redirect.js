(function(ops) {
    const symbols = [ '>', '^', 'v', '<' ];
    let directions = [ 
        new p5.Vector(1, 0), 
        new p5.Vector(0, -1), 
        new p5.Vector(0, 1),
        new p5.Vector(-1, 0)
    ];

    let build = (symbol, dir) => ops.op(symbol, (state) => state.vel(dir));

    
    for (let i = 0; i < symbols.length; i++) {
        const symbol = symbols[i];
        let dir = directions[i];

        build(symbol, dir)
            .mod('~', (m) => {
                m.on('step', (args) => {
                    let state = args[0];
                    let interp = state.parent;


                    let dupe = interp.value(state.position.x + dir.x, state.position.y + dir.y, 
                        dir.x, dir.y);

                    dupe.value = state.value;

                    return false;
                });
            });
    }
})(multis.ops);