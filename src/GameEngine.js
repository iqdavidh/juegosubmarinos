/* @flow */

class GameEngine  {

    constructor(ctx, tokenRoom, jugadorLocal) {

        this.ctx = ctx;
        this.tokenRoom = tokenRoom;
        this.jugadorLocal=jugadorLocal;

        this.listaJugadores = [jugadorLocal];
    }

    addJugador(jugador) {
        this.listaJugadores.push(jugador);
    }

    runEtapaSeleccionarPosicion() {
        const ctx=this.ctx;
        drawEtapaSeleccionarPosicion.local(this.ctx, this.jugadorLocal);

    }


    onClickEtapaSeleccionarPosicion(event){

        console.log(event.clientX + ',' + event.clientY);
    }



}

