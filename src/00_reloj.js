//@flow
/* use strict */

const gameReloj = {


    idInterval: null,
    tiempo: 0,
    getTiempo(): number {
        return this.tiempo;
    },
    start: function () {
        gameReloj.tiempo = 0;
        this.idInterval = window.setInterval(gameReloj.loop, 500);
    },
    stop: function () {

    },
    loop: () => {

        gameReloj.tiempo += 0.5;

        const tiempo = gameReloj.tiempo;

        // console.log(tiempo);

        //recargar de cohetes los submarinos
        let listaSubActivos = gameData.jugadorLocal.getListaSubmarinos()
            .filter(s => {
                return s.getIsActivo() && s.tiempoCoheteReady <= tiempo && s.tiempoCoheteReady > 0;
            })
        ;

        //con estos submarinos construiir cohetes
        listaSubActivos.forEach(s => {
            console.log('l1' + s.ToString());
            const cohete = factoryCohete.jugadorLocal(s);

            gameData.jugadorLocal.listaCohetes.push(cohete);

            s.ResetTiempoCoheteReady();
            console.log('l2' + s.ToString());
        });


    }

};