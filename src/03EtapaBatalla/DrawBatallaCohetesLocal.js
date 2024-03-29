//@flow
"use strict";

const drawBatallaCohetesLocal = {

    isShowTrayectoria: false,

    exe: function (ctx, contadorFrames: number ,listaCohetes :Array<ACohete>) {



        const imgCohete = factoryImgRocket.fromContadorFrame(contadorFrames);
        const sizeCohete = gameConfig.sizeCohete;
        const mitadSizeCohete = sizeCohete / 2;

        const spritesExplosion = gameConfig.resources.imgExplosion;
        const sizeExplosion = 50;
        const mitadSizeExplosion = sizeExplosion / 2;


        listaCohetes.forEach(c => {
            c.mover(contadorFrames);
            //console.log('trayectoria');

            //dibujar linea0
            if (this.isShowTrayectoria) {
                ctx.beginPath();
                ctx.moveTo(c.getPosicionIni().x, c.getPosicionIni().y);
                ctx.lineTo(c.getPosicionFinal().x, c.getPosicionFinal().y);
                ctx.closePath();
                ctx.stroke();
            }

            //sacar el sprite

            if (c.getIsObjetivoAlcanzado()) {

                let etapa = c.getEtapaExplosion();
                if (etapa >= 0) {
                    let x = c.getPosicionFinal().x - mitadSizeExplosion;
                    let y = c.getPosicionFinal().y - mitadSizeExplosion;
                    let sx = etapa * sizeExplosion;
                    ctx.drawImage(spritesExplosion, sx, 0, sizeExplosion, sizeExplosion, x, y, sizeExplosion, sizeExplosion);
                }

            } else {
                let x = c.getPosicion().x - mitadSizeCohete;
                let y = c.getPosicion().y - mitadSizeCohete;

                let sx = c.getAngulo() * sizeCohete;
                ctx.drawImage(imgCohete, sx, 0, sizeCohete, sizeCohete, x, y, sizeCohete, sizeCohete);
            }


        });
    },


};