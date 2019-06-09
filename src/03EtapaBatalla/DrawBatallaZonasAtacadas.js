//@flow
"use strict";

const drawBatallaZonasAtacadas = {


    exe: function (ctx) {


        const sizeCM = gameCacheSize.getSizeCM();

        //recorreer todas las zonas para ver cuales estan ya definidas
        const lista = gameData.listaZonasAtacadas
            .filter(z => {
                return z.isObjetivoAlcanzado === true;
            });

        //con cada zona hacer el dibujo

        lista.forEach(zona => {

            const posicion = zona.posicionRCC.getPosAbs();

            //dibujar zona en negro

            ctx.fillStyle = 'rgba(0,0,0,0.4)';
            ctx.fillRect(posicion.x, posicion.y, sizeCM, sizeCM);


            if (zona.isSubmarino === true) {
                let imgSubmarino=  gameConfig.resources.imgTanqueDest;
                ctx.drawImage(imgSubmarino, 0, 0, 100, 100, posicion.x , posicion.y, sizeCM, sizeCM);
            }

        });

    }

};