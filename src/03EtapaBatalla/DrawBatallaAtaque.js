//@flow
"use strict";

const drawBatallaAtaque = {

    exe: function (ctx) {

        //poner los textos de submarinos y cohetes
        this.contadorSubmarinos(ctx);


    },

    contadorSubmarinos: function (ctx) {
        const jugador = gameData.jugadorLocal;
        const origen = jugador.getOrigenFromIndex();
        const sizeRegion = gameCacheSize.getSizeRegion();
        const delta = gameConfig.deltaSep;

        let numSubmarino = jugador.getNumSubmarinos();
        ctx.fillStyle = "rgba(255, 255, 0, 1)";
        ctx.font = '19px monospace';
        ctx.fillText(numSubmarino.toString(), origen.x + sizeRegion - delta - 20, origen.y + delta - 4);
    }

};