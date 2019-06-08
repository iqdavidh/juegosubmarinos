//@flow
"use strict";

const factoryImgRocket = {


    fromContadorFrame: function (contador: number) {

        //TODO poner que cambie de cahce
        return this.getCache(true);
    },
    cache1: null,
    cache2: null,
    getCache1() {

        const size = 50;

        if (this.cache1) {
            return this.cache1;
        }

        const canvasFrame = document.createElement('canvas');
        canvasFrame.width = size;
        canvasFrame.height = size;
        const ctxFrame = canvasFrame.getContext('2d');


        const wResource = 75;
        const hResource = 19;
        const alfa = size / wResource;


        let y = (size - hResource) / 2;


        //crear cache de todos amgulos -------------------------
        const canvasCache = document.createElement('canvas');
        canvasCache.width = size * 359;
        canvasCache.height = size;

        const ctx = canvasCache.getContext('2d');


        ctxFrame.drawImage(gameConfig.resources.imgRocket, 0, 0,
            wResource, hResource, 0, y, size, hResource * alfa);

        const canvasRot = document.createElement('canvas');
        canvasRot.width = size;
        canvasRot.height = size;
        const ctxRot = canvasRot.getContext('2d');


        ctxRot.save();
        ctxRot.translate(size/2,size/2);
        ctxRot.rotate(-90*Math.PI/180);
        ctxRot.drawImage(canvasFrame, -(size/2), -(size/2));


        ctx.drawImage(canvasRot, 0, 0,
            size, size, 0 * size, 0, size, size);


        // //es el cohete rotado en todos los ángulos
        // for (let i = 0; i < 360; i++) {
        //
        //     ctxFrame.clearRect(0,0,size,size);
        //
        //     if( i%2){
        //         ctxFrame.fillStyle="#ffffff";
        //         ctxFrame.fillRect(0,0,size,size);
        //     }
        //
        //
        //     ctxFrame.drawImage(gameConfig.resources.imgRocket, 0, 0,
        //         wResource, hResource, 0, y, size, hResource * alfa);
        //
        //
        //     ctxFrame.translate(size/2, size/2);
        //     ctxFrame.rotate(90*Math.PI/180);
        //
        //     //dibujar el cohete en el frame ----------------------
        //     ctx.drawImage(canvasFrame, 0, 0,
        //         size, size, i * size, 0, size, size);
        //
        //
        // }


        this.cache1 = canvasCache;

        return this.cache1;

    },
    getCache2() {

        const size = 20;

        if (this.cache2) {
            return this.cache2;
        }

        //crear cache solicitado
        const canvasCache = document.createElement('canvas');
        canvasCache.width = size * 360;
        canvasCache.height = size;

        const ctx = canvasCache.getContext('2d');


        const wResource = 75;
        const hResource = 19;

        const alfa = size / wResource;

        //es el cohete rotado en todos los ángulos
        for (let i = 0; i < 360; i++) {
            let y = (size - hResource) / 2;
            ctx.drawImage(gameConfig.resources.imgRocket, wResource, 0,
                wResource, hResource, i * size, y, size, hResource * alfa);

        }


        this.cache2 = canvasCache;

        return this.cache2;

    },

};