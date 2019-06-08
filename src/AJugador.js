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

    getListaCohetes(): Array<ACohetel> {
        return this.listaCohetes;
    }

    getOrigenFromIndex(): Posicion {
       return factoryPosicionRCCuadrante.getOrigenCuadrante(this.indexCuadrante);
    }
}