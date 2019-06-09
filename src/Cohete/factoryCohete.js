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


        return new CoheteLocal(posicionCentroCohete, jugador.id, submarino.id);

    }

};
