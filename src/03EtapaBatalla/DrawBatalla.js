//@flow
"use strict";

const drawBatalla = {
    drawAllRegions: function (ctx) {

        let cacheMar = this.getCacheCanvasAll();
        ctx.drawImage(cacheMar, 0, 0, gameConfig.size, gameConfig.size);

    },
    cacheRegionAll: null,
    getCacheCanvasAll: function () {

        //vamos a dibujar todos los jugadores
        if (this.cacheRegionAll !== null) {
            return this.cacheRegionAll;
        }

        const sizeRegion = gameCacheSize.getSizeRegion();
        const delta = gameConfig.deltaSep;

        //este canvas tendra todo el mapa
        const cacheCanvas = document.createElement('canvas');
        cacheCanvas.width = gameConfig.size;
        cacheCanvas.height = gameConfig.size;

        const ctx = cacheCanvas.getContext('2d');

        //blanco para reslatar el cambio ----------------------------------------
        ctx.fillStyle = 'yellow';
        ctx.fillRect(0, 0, gameConfig.size, gameConfig.size);

        //dibujar el sector de jugador local con sus submarinos -----------------
        const origenLocal = gameData.jugadorLocal.getOrigenFromIndex();
        ctx.fillStyle = '#000000';
        ctx.fillRect(origenLocal.x, origenLocal.y, sizeRegion, sizeRegion);
        //la seccion de mar
        const sizeMar = sizeRegion - 2 * delta;
        ctx.drawImage(gameConfig.resources.imgMar, 0, 0, sizeMar, sizeMar, delta + origenLocal.x, delta + origenLocal.y, sizeMar, sizeMar);

        //las divisiones
        const sizeDiv = (sizeRegion - (gameConfig.wDivision * gameConfig.numDivisiones)) / gameConfig.numDivisiones;
        const rayaSize = sizeRegion - 2 * delta;

        const sizeCM = (sizeMar - gameConfig.numDivisiones * gameConfig.wDivision) / gameConfig.numDivisiones;


        ctx.fillStyle = "rgba(255, 255, 255, 0.7)";

        for (let i = 1; i < gameConfig.numDivisiones; i++) {
            let xCuadro = origenLocal.x + i * (sizeCM + gameConfig.wDivision) + delta;
            let yCuadro = origenLocal.y + delta;
            ctx.fillRect(xCuadro, yCuadro, gameConfig.wDivision, rayaSize);

            // xCuadro=origenLocal.x + delta
            // ctx.fillRect(delta, i * (sizeCM + gameConfig.wDivision) + delta, rayaSize, gameConfig.wDivision);
        }


        this.cacheRegionAll = cacheCanvas;

        return this.cacheRegionAll;
    },
    resetCacheCanvasAll: function () {
        this.cacheRegionAll = null;
    }
}