class Cohete {

    constructor(posicionIni) {
        this.posicionIni = posicionIni;
        this.estado = 'ready';
        this.velocidad = new Posicion(0, 0, 0);
        this.posicion = null;
    }

    getIsEstadoReady() {
        return this.estado ==='ready';
    }

    getIsEstadoLanzado() {
        return this.estado ==='lanzado';
    }

    lanzar(posicionFinalRC, posicionFinal) {
        this.estado='lanzado';
        this.posicionFinal = posicionFinal;
        this.posicionFinalRC = posicionFinalRC;
    }

    mover() {

    }

}