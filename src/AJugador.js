/* @flow*/
class AJugador {

    constructor(indexCuadrante) {

        this.id = IDGenerator('player');
        this.indexCuadrante = indexCuadrante;
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

    getListaCohetes(): Array<ACohetel> {
        return this.listaCohetes;
    }

    getOrigenFromIndex(): Posicion {
       return factoryPosicionRCCuadrante.getOrigenCuadrante(this.indexCuadrante);
    }
}