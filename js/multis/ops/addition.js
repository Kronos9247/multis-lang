if (typeof multis === "undefined") multis = {};

// multis.ops.op('=')
multis.ops.op("=")
    .mod("+", (m) => {
        
    })
    .req([ '+', '-' ]);