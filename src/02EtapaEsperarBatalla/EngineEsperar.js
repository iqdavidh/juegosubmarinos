/* @flow */

class EngineEsperar extends AEngine {

    constructor(fnOnContinuar) {

        super(fnOnContinuar);


        this.estado = '';
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

        this.estado = 'oscurecer';

        drawEsperar.oscurecer(ctx, fnCallback);
    }

    onJugadorRemotoConfirma() {
        const ctx = this.ctx;


        let numConfirmados = gameData.listaJugadores
            .filter(j => {
                return j.isPosicionConfirmada;
            }).length;

        if (this.estado !== 'saliendo') {
            //poner el texto caundots jugadores estan confirmados
            drawEsperar.actualizarTextoEspera(ctx, gameData.numJugadoresEsperados-1, numConfirmados);
        }

        if ((gameData.numJugadoresEsperados -1)=== numConfirmados &&  gameData.jugadorLocal.isPosicionConfirmada) {
            this.estado = 'saliendo';
            setTimeout(this.fnOnContinuar, 2000);
        }




    }

}