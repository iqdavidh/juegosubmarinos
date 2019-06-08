//@flow
"use strict";

const factoryZonaAtacada = {
    exe: function (posicionRCC: PosicionRCCuadrante, idCohete: string) {

        const isSubmarino = null;
        const id = IDGenerator('zona');
        const indexJugador = posicionRCC.getIndexCuadrante();
        const isObjetivoAlcanzado = false;

        return {
            id,
            idCohete,
            isObjetivoAlcanzado,
            indexJugador,
            posicionRCC,
            isSubmarino
        };
    }
};