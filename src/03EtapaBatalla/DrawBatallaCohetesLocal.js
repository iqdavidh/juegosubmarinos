//@flow
"use strict";

const drawBatallaCohetesLocal = {


    exe: function (ctx, contadorFrames:number) {

        //ctx.drawImage( gameConfig.resources.imgRocket, 0,0,75,19, 0,0,75,19);

        ctx.drawImage( factoryImgRocket.getCache1(),0,0);

        const listaCohetes = gameData.jugadorLocal.getListaCohetes()
            .filter(c => {
                return c.getIsEstadoLanzado();
            });

        //mover los cohetes
        listaCohetes.forEach(c => {
            c.mover();
            console.log('trayectoria');

            //dibujar linea
            ctx.beginPath();
            ctx.moveTo(c.getPosicionIni().x, c.getPosicionIni().y);
            ctx.lineTo(c.getPosicionFinal().x, c.getPosicionFinal().y);
            ctx.closePath();
            ctx.stroke();



        });
    },



};