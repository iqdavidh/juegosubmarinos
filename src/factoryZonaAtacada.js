//@flow
"use strict";

const factoryZonaAtacada = {
    exe: function (posicionRCC: PosicionRCCuadrante, idCohete: string, id_jugador: string, isObjetivoAlcanzado = false
)
{

    let isSubmarino = null;
    const id = IDGenerator('zona');
    const indexCuadrante = posicionRCC.getIndexCuadrante();


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
}
;