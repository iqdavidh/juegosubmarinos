/*@flow*/

const drawSelPos = {

    drawSubmarino: function (ctx, submarino: Submarino) {

        const origen = submarino.jugador.getOrigenFromIndex();
        const delta = gameConfig.deltaSep;

        const origenMar = new Posicion(origen.x + delta, origen.y + delta);
        const sizeCM = gameCacheSize.getSizeCM();

        const x = origenMar.x + (submarino.getPosicionRC().c - 1) * (sizeCM + gameConfig.wDivision);
        const y = origenMar.y + (submarino.getPosicionRC().r - 1) * (sizeCM + gameConfig.wDivision);

        //se dibuja diferente si esta en drag
        if( submarino.isOnDrag){
            ctx.fillStyle = "rgba(100, 100, 100, 0.5)";
        }else{
            ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
        }

        let submarinoSize=sizeCM / 2;
        let dy=sizeCM/4;

        ctx.fillRect(x +dy, y +sizeCM/4,submarinoSize , submarinoSize);
    },
    drawDragSubmarino:function(ctx,posicionRCC: PosicionRCCuadrante){

        const origen =factoryPosicionRCCuadrante.getOrigenCuadrante( posicionRCC.getIndexCuadrante());

        const delta = gameConfig.deltaSep;

        const origenMar = new Posicion(origen.x + delta, origen.y + delta);
        const sizeCM = gameCacheSize.getSizeCM();

        const x = origenMar.x + (posicionRCC.getC() - 1) * (sizeCM + gameConfig.wDivision);
        const y = origenMar.y + (posicionRCC.getR() - 1) * (sizeCM + gameConfig.wDivision);

        ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
        let submarinoSize=sizeCM / 2;
        ctx.fillRect(x +sizeCM/4, y +sizeCM/4,submarinoSize , submarinoSize);


    },

    local: function (ctx, jugador: JugadorLocal) {

        const delta = gameConfig.deltaSep;
        const sizeRegion = gameCacheSize.getSizeRegion();

        let cacheRegionConMar = this.getCacheCanvasRegionConMar(jugador);

        let origen = jugador.getOrigenFromIndex();


        /* draw el cache  */
        ctx.drawImage(cacheRegionConMar, 0, 0, sizeRegion, sizeRegion, origen.x, origen.y, sizeRegion, sizeRegion);


        /* actualziar dra numero sub*/
        let numSubmarino = jugador.getNumSubmarinos();
        ctx.fillStyle = "rgba(255, 255, 0, 1)";
        ctx.font = '19px monospace';
        ctx.fillText(numSubmarino.toString(), origen.x + sizeRegion - delta - 20, origen.y + delta - 4);



        let sizeTexto=470;
        let dx= ( (sizeRegion *3) - sizeTexto )/2;
        ctx.fillStyle = "rgba(255, 255, 255, 1)";
        ctx.fillText('Arrastra los submarinos a la posición deseada', dx, sizeRegion*2+50);
        ctx.fillText('Presiona Enter para continuar', dx +80, sizeRegion*2+100);


        jugador.getListaSubmarinos().forEach(s => {
            this.drawSubmarino(ctx, s);
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
        const origen = jugador.getOrigenFromIndex();
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
        ctxCache.font = '19px monospace';
        ctxCache.fillStyle = "rgba(200, 200, 200, 0.7)";
        ctxCache.fillText('SUBMARINOS', sizeMar - 112, 16);

        this.cacheCanvasRegionConMar = cacheRegionConMar;

        return cacheRegionConMar;

    },
    onClickCanvas(x: number, y: number) :void {


    },
    onMouseHoverCanvas(x,y):void{
        console.log(`${x},${y}`);
    }
};


