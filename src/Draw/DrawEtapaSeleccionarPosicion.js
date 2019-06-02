/*@flow*/

const drawEtapaSeleccionarPosicion = {
    local: function (ctx, jugador: JugadorLocal) {
        const sizeRegion = gameConfig.size / 3;
        const delta = gameConfig.deltaSep;

        const cacheRegionConMar = document.createElement('canvas');
        cacheRegionConMar.width = sizeRegion;
        cacheRegionConMar.height = sizeRegion;

        let origen = getOriginFromIndex(jugador.indexCuadrante);
        cacheRegionConMar.fillRect(0, 0, sizeRegion, sizeRegion);

        //la seccion de mar
        let sizeMar = sizeRegion - 2 * delta;
        let origenMar = new Posicion(origen.x + delta, origen.y + delta);
        cacheRegionConMar.drawImage(gameConfig.resources.imgMar, 0, 0, sizeMar, sizeMar, delta,delta, sizeMar, sizeMar);


        ctx.drawImage(cacheRegionConMar, 0, 0, sizeRegion, sizeRegion, origenMar.x, origenMar.y, sizeMar, sizeMar);


        let numCoheteListo = jugador.getListaCohetes()
            .filter(c => {
                return c.getIsEstadoReady();
            }).length;

        let texto = `${numCoheteListo} cohetes listos`;



    }

};


function getOriginFromIndex(index): Posicion {
    const size = gameConfig.size;
    const delta = gameConfig.deltaSep;

    if (index === 0) {
        return new Posicion(size * .33, size * .33, 0)
    } else {
        throw new Error("No tenemos eseIndex de jugador");
    }

}