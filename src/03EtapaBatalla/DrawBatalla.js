//@flow

const drawBatalla={
    drawAllRegions:function(ctx){

        let cacheMar=this.getCacheCanvasAll();
        ctx.drawImage( cacheMar,0,0, gameConfig.size,gameConfig.size);

    },
    cacheRegionAll:null,
    getCacheCanvasAll:function(){

        //vamos a dibujar todos los jugadores
        if (this.cacheRegionAll !== null) {
            return this.cacheRegionAll;
        }

        const sizeRegion = gameConfig.size / 3;
        const delta = gameConfig.deltaSep;

        //este canvas tendra todo el mapa
        const cacheCanvas = document.createElement('canvas');
        cacheCanvas.width = gameConfig.size ;
        cacheCanvas.height = gameConfig.size ;

        const ctx = cacheCanvas.getContext('2d');

        //demo
        ctx.fillStyle='#ffffff';
        ctx.fillRect(0,0,100,100);

        this.cacheRegionAll=cacheCanvas;

        return this.cacheRegionAll;
    },
    resetCacheCanvasAll:function(){
        this.cacheRegionAll=null;
    }
}