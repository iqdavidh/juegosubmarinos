/* @flow*/
class AJugador {

    constructor(indexCuadrante, id_jugador: null) {

        if (id_jugador) {
            this.id = id_jugador;
        } else {
            this.id = 'player-' + (Math.random().toString(36).substring(2, 16) + Math.random().toString(36).substring(2, 16)).toUpperCase();
        }

        this.indexCuadrante = indexCuadrante;
        this.isPosicionConfirmada = false;

        this.getIsLocal = () => {
            return indexCuadrante === 0;
        };


        this.listaCohetes = [];

    }


    getIndexCuadrante() {
        return this.indexCuadrante;
    }

    setPosicionConfirmada() {
        this.isPosicionConfirmada = true;
    }

    getListaCohetes(): Array<ACohetel> {
        return this.listaCohetes;
    }

    getOrigenFromIndex(): Posicion {
        return factoryPosicionRCCuadrante.getOrigenCuadrante(this.indexCuadrante);
    }
}