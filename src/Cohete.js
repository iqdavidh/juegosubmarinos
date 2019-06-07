class Cohete {

    constructor(posicionIni, jugador: AJugador) {
        this.id = IDGenerator();

        this.posicionIni = posicionIni;
        this.estado = 'ready';
        this.velocidad = new Posicion(0, 0, 0);
        this.posicion = null;
        this.jugador = jugador;
    }

    getIsEstadoReady() {
        return this.estado === 'ready';
    }

    getIsEstadoLanzado() {
        return this.estado === 'lanzado';
    }

    lanzar(posicionFinalRC, posicionFinal) {
        this.estado = 'lanzado';
        this.posicionFinal = posicionFinal;
        this.posicionFinalRC = posicionFinalRC;
    }

    mover() {

    }

}

const factoryCohete = {
    jugadorLocal: function (submarino: Submarino) {

        //let posicion= submarino.

        let jugador = gameData.jugadorLocal;

        let origen = jugador.getOrigenFromIndex();
        let posRel = submarino.getPosicionXYRel();

        const sizeCM = gameCacheSize.getSizeCM();

        let x = origen.x + posRel.x + sizeCM / 2;
        let y = origen.y + posRel.y + sizeCM / 2;

        let posicionCentroCohete=new Posicion(x,y);


        return new Cohete( posicionCentroCohete, jugador);


    }
};

