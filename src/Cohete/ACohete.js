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
        this.callbackAlLanzar = null;
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

        //centrar el cuadrantes
        this.posicionFinal.x += gameCacheSize.getSizeCM() / 2;
        this.posicionFinal.y += gameCacheSize.getSizeCM() / 2;

        if (this.callbackAlLanzar) {
            this.callbackAlLanzar();
        }
    }

    mover() {
        this.posicion.x += this.velocidad.x;
        this.posicion.y += this.velocidad.y;
    }

    getPosicionIni(): Posicion {
        return this.posicionIni;
    }

    getPosicionFinal(): Posicion {
        return this.posicionFinal;
    }
}