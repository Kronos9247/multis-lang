// library declaration (just things i really need)
declare namespace p5 {
    interface Vector {
        x : number, y : number, z : number
    }
}

declare namespace multis {
    declare type opcode = string;

    declare namespace editor {
        declare class Selector {
            constructor(onpaint : any, width : number, height : number, canvas : any)

            setup() : void
            draw() : void
            keyPressed(code : number) : void
            mousePressed(btn : number) : void
            getAction() : opcode
        }
    }

    declare class State {

    }

    declare class Interpreter {
        parent? : multis.Universe
        states : Array<multis.State>

        events : any[]
        ops : any[]
        imods : any[]
        

        initCell(pos : p5.Vector, ops : any, store : multis.Universe) : void
        init() : void
        step() : void
        reset() : void
        
        value(x : number, y : number, velx : number, vely : number) : multis.State
        specific(position : p5.Vector) : void
        regs(pos : p5.Vector, op : opcode) : void

        inspect(x : number, y : number, tx : number, ty : number) : void
        inspection() : void
    }

    declare class Universe {
        interpreter : multis.Interpreter
        width : number
        height : number
        cells? : opcode[][]

        reset(width : number, height : number) : void
        set(x : number, y : number, op : opcode) : void
        empty() : void
        json(input? : string|object, clear? : boolean) : string?
    }
}

declare var interp : multis.Interpreter;
declare var store : multis.Universe;