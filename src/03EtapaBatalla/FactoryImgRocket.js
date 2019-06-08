//@flow
"use strict";

const factoryImgRocket = {


    fromContadorFrame: function (contador: number) {

        let contadorSprite= contador % 10;

        if(contadorSprite<5){
            return this.getCache1();
        }else{
            return this.getCache2();
        }


        //TODO poner que cambie de cahce

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





        //es el cohete rotado en todos los ángulos
        for (let i = 0; i < 360; i++) {

            const canvasRot = document.createElement('canvas');
            canvasRot.width = size;
            canvasRot.height = size;
            const ctxRot = canvasRot.getContext('2d');

            ctxRot.translate(size / 2, size / 2);
            ctxRot.rotate(-i * Math.PI / 180);
            ctxRot.drawImage(canvasFrame, -(size / 2), -(size / 2));


            ctx.drawImage(canvasRot, 0, 0,
                size, size, i * size, 0, size, size);

            ctxRot.restore();


        }


        this.cache1 = canvasCache;

        return this.cache1;

    },
    getCache2() {

        //copy paste de getCache1
        const size = 50;

        if (this.cache2) {
            return this.cache2;
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


        /*este frame es desplazado del sprint */
        ctxFrame.drawImage(gameConfig.resources.imgRocket, wResource, 0,
            wResource, hResource, 0, y, size, hResource * alfa);





        //es el cohete rotado en todos los ángulos
        for (let i = 0; i < 360; i++) {

            const canvasRot = document.createElement('canvas');
            canvasRot.width = size;
            canvasRot.height = size;
            const ctxRot = canvasRot.getContext('2d');

            ctxRot.translate(size / 2, size / 2);
            ctxRot.rotate(-i * Math.PI / 180);
            ctxRot.drawImage(canvasFrame, -(size / 2), -(size / 2));


            ctx.drawImage(canvasRot, 0, 0,
                size, size, i * size, 0, size, size);

            ctxRot.restore();


        }


        this.cache2 = canvasCache;

        return this.cache2;
    },

};