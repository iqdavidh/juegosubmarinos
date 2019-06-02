/*@flow*/

const drawEtapaSeleccionarPosicion = {

    drawSubmarino: function (ctx,submarino: Submarino) {

        const sizeRegion = gameConfig.size / 3;
        const origen = getOriginFromIndex(submarino.jugador.indexCuadrante);
        const delta = gameConfig.deltaSep;

        const sizeMar = sizeRegion - 2 * delta;

        const origenMar = new Posicion(origen.x + delta, origen.y + delta);

        const sizeCM = (sizeMar - gameConfig.numDivisiones * gameConfig.wDivision) / gameConfig.numDivisiones;

        console.log(submarino.getPosicionRC());

        const x = origenMar.x + (submarino.getPosicionRC().r-1) * (sizeCM + gameConfig.wDivision);
        const y = origenMar.y + (submarino.getPosicionRC().c-1 )* (sizeCM + gameConfig.wDivision);

        ctx.fillRect(x,y, sizeCM/2, sizeCM/2);


    },
    local: function (ctx, jugador: JugadorLocal) {
        const sizeRegion = gameConfig.size / 3;
        const delta = gameConfig.deltaSep;


        let cacheRegionConMar = this.getCacheCanvasRegionConMar(jugador);

        let origen = getOriginFromIndex(jugador.indexCuadrante);


        /* draw el cache  */
        ctx.drawImage(cacheRegionConMar, 0, 0, sizeRegion, sizeRegion, origen.x, origen.y, sizeRegion, sizeRegion);

        //ctxCache.fillText('COHETES LISTOS', delta + 24, sizeMar + delta + 18);

        /* actualziar dra numero coehtes*/
        // let numCoheteListo = jugador.getNumCohetesReady();
        //
        // ctx.font = '20px monospace';
        // ctx.fillStyle = "rgba(0, 255, 0, 1)";
        // ctx.fillText(numCoheteListo.toString(), origenMar.x, origenMar.y + sizeMar + 18);


        /* actualziar dra numero sub*/
        let numSubmarino = jugador.getNumSubmarinos();
        ctx.fillStyle = "rgba(255, 255, 0, 1)";
        ctx.font = '20px monospace';
        ctx.fillText(numSubmarino.toString(), origen.x + sizeRegion - delta - 20, origen.y + delta - 6);


        jugador.getListaSubmarinos().forEach(s => {
            this.drawSubmarino(ctx,s);
        });


    },

    cacheCanvasRegionConMar: null,

    getCacheCanvasRegionConMar: function (jugador: JugadorLocal) {

        if (this.cacheCanvasRegionConMar !== null) {
            return this.cacheCanvasRegionConMar;
        }

        const sizeRegion = gameConfig.size / 3;
        const delta = gameConfig.deltaSep;


        const cacheRegionConMar = document.createElement('canvas');
        cacheRegionConMar.width = sizeRegion;
        cacheRegionConMar.height = sizeRegion;

        const ctxCache = cacheRegionConMar.getContext('2d');

        //el decorado de la region
        const origen = getOriginFromIndex(jugador.indexCuadrante);
        ctxCache.fillRect(0, 0, sizeRegion, sizeRegion);

        //la seccion de mar
        const sizeMar = sizeRegion - 2 * delta;
        ctxCache.drawImage(gameConfig.resources.imgMar, 0, 0, sizeMar, sizeMar, delta, delta, sizeMar, sizeMar);

        //las divisiones
        const sizeDiv = (sizeRegion - (gameConfig.wDivision * gameConfig.numDivisiones)) / gameConfig.numDivisiones;
        const rayaSize = sizeRegion - 2 * delta;

        const sizeCM = (sizeMar - gameConfig.numDivisiones * gameConfig.wDivision) / gameConfig.numDivisiones;


        ctxCache.fillStyle = "rgba(255, 255, 255, 0.7)";

        for (let i = 1; i < gameConfig.numDivisiones; i++) {
            ctxCache.fillRect(i * (sizeCM + gameConfig.wDivision) + delta, delta, gameConfig.wDivision, rayaSize);
            ctxCache.fillRect(delta, i * (sizeCM + gameConfig.wDivision) + delta, rayaSize, gameConfig.wDivision);
        }

        /* el cache de texto */
        ctxCache.font = '20px monospace';
        ctxCache.fillStyle = "rgba(200, 200, 200, 0.7)";
        ctxCache.fillText('SUBMARINOS', delta + 70, 24);

        this.cacheCanvasRegionConMar = cacheRegionConMar;

        return cacheRegionConMar;

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