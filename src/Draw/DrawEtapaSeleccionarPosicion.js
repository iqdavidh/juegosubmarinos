/*@flow*/

const drawEtapaSeleccionarPosicion = {
    local: function (ctx, jugador : JugadorLocal) {
        const sizeRegion = gameConfig.size/3;
        const delta = gameConfig.deltaSep;

        let origen= getOriginFromIndex(jugador.indexCuadrante);
        ctx.fillRect(origen.x, origen.y, sizeRegion, sizeRegion);
    }

};



function getOriginFromIndex(index): Posicion {
    const size = gameConfig.size;
    const delta = gameConfig.deltaSep;

    if (index === 0) {
        return new Posicion(size *.33 , size*.33,0)
    }else{
        throw new Error("No tenemos eseIndex de jugador");
    }

}