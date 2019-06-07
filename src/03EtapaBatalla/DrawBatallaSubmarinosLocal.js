//@flow
"use strict";

const drawBatallaSubmarinosLocal = {

    cacheSubmarinosLocal: null,
    exe: function (ctx) {

        const sizeRegion = gameCacheSize.getSizeRegion();

        let cache = this.getCacheSubmarinosLocal();

        let origen = gameData.jugadorLocal.getOrigenFromIndex();

        ctx.drawImage(cache, 0, 0, sizeRegion, sizeRegion, origen.x, origen.y, sizeRegion, sizeRegion);

    },

    drawSubmarino: function (ctxRegion, submarino: Submarino) {

        const origen = submarino.jugador.getOrigenFromIndex();
        const delta = gameConfig.deltaSep;


        const sizeCM = gameCacheSize.getSizeCM();

        const v1 = (submarino.getPosicionRC().c - 1) * (sizeCM + gameConfig.wDivision);
        const x = delta + v1;

        const v2 = (submarino.getPosicionRC().r - 1) * (sizeCM + gameConfig.wDivision);
        const y = delta + v2;

        if (submarino.isActivo) {
            ctxRegion.fillStyle = "rgba(255, 255, 255, 0.5)";
        } else {
            ctxRegion.fillStyle = "rgba(0, 0, 0, 0.5)";
        }
        let submarinoSize = sizeCM / 2;
        let dy = sizeCM / 4;

        console.log(`x,y ${x},${y}`);
        ctxRegion.fillRect(x + dy, y + sizeCM / 4, submarinoSize, submarinoSize);

    },

    getCacheSubmarinosLocal: function () {

        //vamos a dibujar todos los jugadores
        if (this.cacheSubmarinosLocal !== null) {
            return this.cacheSubmarinosLocal;
        }

        const jugador = gameData.jugadorLocal;

        const sizeRegion = gameCacheSize.getSizeRegion();
        const delta = gameConfig.deltaSep;

        //este canvas tendra todo el mapa
        const cacheCanvasRegion = document.createElement('canvas');
        cacheCanvasRegion.width = sizeRegion;
        cacheCanvasRegion.height = sizeRegion;

        const ctxRegion = cacheCanvasRegion.getContext('2d');

        //los submarinos listos
        let numActivos = 0;
        jugador.getListaSubmarinos()
            .forEach(s => {

                    this.drawSubmarino(ctxRegion, s);

                    if (s.isActivo) {
                        numActivos++;
                    }
                }
            );

        //dibujar texto de activos


        // /* actualziar dra numero sub*/
        // let numSubmarino = jugador.getNumSubmarinos();
        // ctx.fillStyle = "rgba(255, 255, 0, 1)";
        // ctx.font = '19px monospace';
        // ctx.fillText(numSubmarino.toString(), origen.x + sizeRegion - delta - 20, origen.y + delta - 4);

        this.cacheSubmarinosLocal = cacheCanvasRegion;

        return cacheCanvasRegion;

    }
};