//@flow
"use strict";

const factoryZonaAtacada = {
    exe: function (posicionRCC: PosicionRCCuadrante, idCohete: string, id_jugador:string) {

        const isSubmarino = null;
        const id = IDGenerator('zona');
        const indexCuadrante = posicionRCC.getIndexCuadrante();
        const isObjetivoAlcanzado = false;

        return {
            id,
            idCohete,
            isObjetivoAlcanzado,
            indexCuadrante,
            id_jugador,
            posicionRCC,
            isSubmarino
        };
    }
};