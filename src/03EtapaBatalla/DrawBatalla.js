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
        ctx.fillStyle = 'darkslategray';
        ctx.fillRect(0, 0, gameConfig.size, gameConfig.size);

        //dibujar el sector de jugador local con sus submarinos -----------------

        const sizeMar = sizeRegion - 2 * delta;
        const sizeDiv = (sizeRegion - (gameConfig.wDivision * gameConfig.numDivisiones)) / gameConfig.numDivisiones;
        const rayaSize = sizeRegion - 2 * delta;
        const sizeCM = (sizeMar - gameConfig.numDivisiones * gameConfig.wDivision) / gameConfig.numDivisiones;


        function drawSeccionFromOrigen(origen) {
            ctx.fillStyle = '#000000';
            ctx.fillRect(origen.x, origen.y, sizeRegion, sizeRegion);

            //la seccion de mar
            ctx.drawImage(gameConfig.resources.imgMar, 0, 0, sizeMar, sizeMar, delta + origen.x, delta + origen.y, sizeMar, sizeMar);

            ctx.fillStyle = "rgba(255, 255, 255, 0.7)";

            for (let i = 1; i < gameConfig.numDivisiones; i++) {
                let xCuadro = origen.x + i * (sizeCM + gameConfig.wDivision) + delta;
                let yCuadro = origen.y + delta;
                ctx.fillRect(xCuadro, yCuadro, gameConfig.wDivision, rayaSize);

                xCuadro = origen.x + delta;
                yCuadro = origen.y + i * (sizeCM + gameConfig.wDivision) + delta;
                ctx.fillRect(xCuadro, yCuadro, rayaSize, gameConfig.wDivision);
            }

            ctx.font = '19px monospace';
            ctx.fillStyle = "rgba(200, 200, 200, 0.7)";
            ctx.fillText('SUBMARINOS', origen.x + sizeMar - 112, origen.y + 16);


        }


        let listaOrigen = gameData.listaJugadores.map(j => {
            return j.getOrigenFromIndex();
        });

        listaOrigen.unshift(gameData.jugadorLocal.getOrigenFromIndex());

        listaOrigen.map(origen => {
            drawSeccionFromOrigen(origen);
        });


        this.cacheRegionAll = cacheCanvas;

        return this.cacheRegionAll;
    },
    resetCacheCanvasAll: function () {
        this.cacheRegionAll = null;
    }
}