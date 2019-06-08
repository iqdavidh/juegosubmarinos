//@flow
"use strict";

const drawBatallaContadores = {

    exe: function (ctx) {
        //para el jugador local
        this.contadorCohetes(ctx);

        //local y remoito
        this.contadorSubmarinos(ctx);
    },
    contadorSubmarinos: function (ctx) {

        const sizeRegion = gameCacheSize.getSizeRegion();
        const delta = gameConfig.deltaSep;

        let listaJugador = gameData.listaJugadores.map(j => {
            return j;
        });

        listaJugador.unshift(gameData.jugadorLocal);

        listaJugador.map(jugador => {

            const numSubmarino = jugador.getNumSubmarinos();
            const origen=jugador.getOrigenFromIndex();

            ctx.fillStyle = "rgba(255, 255, 0, 1)";
            ctx.font = '19px monospace';
            ctx.fillText(numSubmarino.toString(), origen.x + sizeRegion - delta - 20, origen.y + delta - 4);

        });
    },
    contadorCohetes: function (ctx) {
        const jugador = gameData.jugadorLocal;
        const origen = jugador.getOrigenFromIndex();
        const delta = gameConfig.deltaSep;

        let numCohetes = jugador.getNumCohetesReady();

        ctx.fillStyle = "rgba(255, 255, 255, 1)";
        ctx.font = '19px monospace';
        ctx.fillText(numCohetes.toString(), origen.x +  delta + 20, origen.y + delta - 4);
    }

};