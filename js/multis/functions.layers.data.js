if (typeof multis === "undefined") multis = {};

(function(obj) {
    class Container {
        constructor(parent) {
            this.parent = parent;
        }
    }

    obj.Container = Container;
})(multis);