/* @flow*/
class AJugador {

    constructor(indexCuadrante) {
        this.indexCuadrante = indexCuadrante;
        this.id = parseInt(Math.random() * 100000);
        this.isPosicionConfirmada = false;

        this.getIsLocal = () => {
            return indexCuadrante === 0;
        };

        this.listaAtaquesRecibidos = [];
        this.listaCohetes = [];

    }


    setPosicionConfirmada() {
        this.isPosicionConfirmada = true;
    }

    getListaCohetes(): Array<Cohete> {
        return this.listaCohetes;
    }

    getOrigenFromIndex(): Posicion {
        const size = gameConfig.size;
        const delta = gameConfig.deltaSep;


        if (this.indexCuadrante === 0) {
            return new Posicion(size * .33, size * .33, 0)
        } else {
            throw new Error("No tenemos eseIndex de jugador");
        }

    }
}