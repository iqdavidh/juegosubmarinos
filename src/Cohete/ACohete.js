//@flow
"use strict";

class ACohete {

    constructor(posicionIni: Posicion, id_jugador: string) {
        this.id = IDGenerator();
        this.posicionIni = posicionIni;
        this.posicionFinal = null;
        this.posicion = posicionIni.clonar();

        this.estado = 'ready';
        this.velocidad = new Posicion(0, 0, 0);
        this.id_jugador = id_jugador;
        this.callbackAlLanzar=null;
    }

    getIsEstadoReady() {
        return this.estado === 'ready';
    }

    getIsEstadoLanzado() {
        return this.estado === 'lanzado';
    }

    lanzar(posicionFinal: Posicion) {
        console.log(`cohete lanzado ${this.id}`);
        this.estado = 'lanzado';
        this.posicionFinal = posicionFinal;
        if(this.callbackAlLanzar){
            this.callbackAlLanzar();
        }
    }

    mover() {

    }
}