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

        //crear cache solicitado
        const canvasCache = document.createElement('canvas');
        canvasCache.width = size * 360;
        canvasCache.height = size;

        const ctx=canvasCache.getContext('2d');

        const wResource=75;
        const hResource=19;
        const alfa= size/wResource;

        //es el cohete rotado en todos los ángulos
        for (let i = 0; i < 360; i++) {
            let y = (size-hResource)/2;
            ctx.drawImage( gameConfig.resources.imgRocket, 0, 0,
                wResource , hResource, i* size, y, size, hResource * alfa );

        }


        this.cache1=canvasCache;

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

        const ctx=canvasCache.getContext('2d');


        const wResource=75;
        const hResource=19;

        const alfa= size/wResource;

        //es el cohete rotado en todos los ángulos
        for (let i = 0; i < 360; i++) {
            let y = (size-hResource)/2;
            ctx.drawImage( gameConfig.resources.imgRocket, wResource, 0,
                wResource , hResource, i* size, y, size, hResource * alfa );

        }


        this.cache2=canvasCache;

        return this.cache2;

    },

};