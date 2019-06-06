/* @flow */

class EngineEsperar extends AEngine {

    constructor(fnOnContinuar) {

        super(fnOnContinuar);


    }

    run() {
        const ctx = this.ctx;
        const jugador = this.jugadorLocal;
        const listaJugadores = gameData.listaJugadores;

        this.isRunning = true;

        //Fase 1 oscurecer la ultima vista

        let fnCallback = () => {
            //actulizar texto de jugadores confirmados
            this.onJugadorRemotoConfirma();
        };

        drawEsperar.oscurecer(ctx, fnCallback);
    }

    onJugadorRemotoConfirma() {
        const ctx = this.ctx;
        let numJugadores = gameData.listaJugadores.length;


        let numConfirmados = gameData.listaJugadores
            .filter(j => {
                return j.isPosicionConfirmada;
            }).length;


        //poner el texto caundots jugadores estan confirmados
        drawEsperar.actualizarTextoEspera(ctx, numJugadores, numConfirmados);


        if (numJugadores === numConfirmados) {


            setTimeout( this.fnOnContinuar, 2000);
        }

    }

}