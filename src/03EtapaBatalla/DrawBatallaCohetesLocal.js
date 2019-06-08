//@flow
"use strict";

const drawBatallaCohetesLocal = {


    exe: function (ctx, contadorFrames: number) {

        const listaCohetes = gameData.jugadorLocal.getListaCohetes()
            .filter(c => {
                return c.getIsEstadoLanzado();
            });

        //mover los cohetes


        const img = factoryImgRocket.fromContadorFrame(contadorFrames);


        const sizeCohete = gameConfig.sizeCohete;
        const mitadSizeCohete = sizeCohete / 2;


        listaCohetes.forEach(c => {
            c.mover();
            //console.log('trayectoria');

            //dibujar linea0
            ctx.beginPath();
            ctx.moveTo(c.getPosicionIni().x, c.getPosicionIni().y);
            ctx.lineTo(c.getPosicionFinal().x, c.getPosicionFinal().y);
            ctx.closePath();
            ctx.stroke();

            //sacar el sprite
            let sx = c.getAngulo() * sizeCohete;
            let x = c.getPosicion().x - mitadSizeCohete;
            let y = c.getPosicion().y - mitadSizeCohete;


            ctx.drawImage(img, sx, 0, sizeCohete, sizeCohete, x, y, sizeCohete, sizeCohete);


        });
    },


};