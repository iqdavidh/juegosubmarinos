/*@flow*/

const drawEtapaSeleccionarPosicion = {
    local: function (ctx, jugador: JugadorLocal) {
        const sizeRegion = gameConfig.size / 3;
        const delta = gameConfig.deltaSep;

        const cacheRegionConMar = document.createElement('canvas');
        cacheRegionConMar.width = sizeRegion;
        cacheRegionConMar.height = sizeRegion;

        const ctxCache= cacheRegionConMar.getContext('2d');

        //el decorado de la region
        let origen = getOriginFromIndex(jugador.indexCuadrante);
        ctxCache.fillRect(0, 0, sizeRegion, sizeRegion);

        //la seccion de mar
        let sizeMar = sizeRegion - 2 * delta;
        let origenMar = new Posicion(origen.x + delta, origen.y + delta);
        ctxCache.drawImage(gameConfig.resources.imgMar, 0, 0, sizeMar, sizeMar, delta, delta, sizeMar, sizeMar);

        //las divisiones
        let sizeDiv = (sizeRegion - (gameConfig.wDivision * gameConfig.numDivisiones)) / gameConfig.numDivisiones;
        let rayaSize = sizeRegion - 2 * delta;

        let sizeCM = (sizeMar - gameConfig.numDivisiones * gameConfig.wDivision) / gameConfig.numDivisiones;


        ctxCache.fillStyle = "rgba(255, 255, 255, 1)";

        for (let i = 1; i < gameConfig.numDivisiones; i++) {
            ctxCache.fillRect(i * (sizeCM + gameConfig.wDivision) + delta, delta, gameConfig.wDivision, rayaSize);
            ctxCache.fillRect(delta,i * (sizeCM + gameConfig.wDivision) + delta, rayaSize,  gameConfig.wDivision);
        }

        /* el cache de texto */
        ctxCache.font = '20px monospace';
        ctxCache.fillText('COHETES LISTOS', delta + 24, sizeMar + delta + 18);


        /**/

        ctx.drawImage(cacheRegionConMar, 0, 0, sizeRegion, sizeRegion, origenMar.x, origenMar.y, sizeRegion, sizeRegion);


        let numCoheteListo = jugador.getListaCohetes()
            .filter(c => {
                return c.getIsEstadoReady();
            }).length;






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