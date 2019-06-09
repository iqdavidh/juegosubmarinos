//@flow
"use strict";


const factoryCohete = {
    jugadorLocal: function (submarino: Submarino) {

        //let posicion= submarino.

        let jugador = gameData.jugadorLocal;

        let origen = jugador.getOrigenFromIndex();
        let posRel = submarino.getPosicionXYRel();

        const sizeCM = gameCacheSize.getSizeCM();

        let x = origen.x + posRel.x + sizeCM / 2;
        let y = origen.y + posRel.y + sizeCM / 2;

        let posicionCentroCohete = new Posicion(x, y);

        //el cohete sale de este cuadrante
        const indexCuadrante=0;

        return new CoheteLocal(posicionCentroCohete, jugador.id, submarino.id, indexCuadrante);

    }

};
