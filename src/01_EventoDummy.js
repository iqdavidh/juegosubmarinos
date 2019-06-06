//@flow

let EventoDummy = {

    token:'*token*',

    iniciar2Jugadores: function () {

        gameController.onRegistroSocket(this.token);

        let msg = {
            id_jugador: 2000,
            token: this.token
        };

        let jugador2 = factoryJugadorRemoto.fromMsgJugadorIngresa(msg);
        gameData.listaJugadores.push(jugador2);

    },
    confirmaJugador: function () {

        //el jugador que tenemos envia mensjae de confirmarciopn
        let j = gameData.listaJugadores
            .find(
                item => {
                    return !item.isPosicionConfirmada
                }
            )
        ;

        let msg=factoryMensajeSocket.JugadorConfirma( this.token, j.id);


        gameController.onRecibirMensajeSocket(msg);
    },
    iniciar3Jugadores:function () {
        this.iniciar2Jugadores();



        let msg = {
            id_jugador: 3000,
            token: this.token
        };

        let jugador3 = factoryJugadorRemoto.fromMsgJugadorIngresa(msg);
        gameData.listaJugadores.push(jugador3);
    }
};