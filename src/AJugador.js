/* @flow*/
class AJugador {

    constructor(indexCuadrante) {

        this.id = 'player-' + (Math.random().toString(36).substring(2, 16) + Math.random().toString(36).substring(2, 16)).toUpperCase();
        this.indexCuadrante = indexCuadrante;
        this.isPosicionConfirmada = false;

        this.getIsLocal = () => {
            return indexCuadrante === 0;
        };

        this.listaAtaquesRecibidos = [];
        this.listaCohetes = [];

    }


    getIndexCuatrante(){
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