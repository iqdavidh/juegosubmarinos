//@flow

let EventoDummy = {

    iniciar2Jugadores: function () {
        let token = '*token*';
        gameController.onRegistroSocket(token);

        let msg = {
            id_jugador: 2000,
            token: token
        };

        let jugador2 = factoryJugadorRemoto.fromMsgJugadorIngresa(msg);
        gameData.listaJugadores.push(jugador2);
        gameController.onRegistroSocket(token);

    },
    confirmaJugador2: function () {
        let j = factoryJugador.gameEngine.addJugador(j);
    }
};