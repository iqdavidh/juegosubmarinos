/* @flow */

class Posicion {

    constructor(x, y, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    toString() {
        return `${this.x}, ${this.y}`;
    }

    clonar() {
        return new Posicion(this.x, this.y, this.z);
    }
}