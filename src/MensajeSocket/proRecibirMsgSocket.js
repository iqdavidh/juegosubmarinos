/* @flow */

const proRecibirMsgSocket = {
    exe: function (msg) {

        const jugador = this.getJugadorFromId(msg.id_jugador);

        if (msg.tipo === tipoMsgSocket.ingresa) {
            this.jugador_ingresa(jugador);


        } else if (msg.tipo === tipoMsgSocket.confirma_posiciones) {
            this.jugador_confirma_posicion(jugador)

        } else {
            alert("no esperamos este tipo de mensaje " + msg.tipo)
        }


    },
    jugador_ingresa: function (jugador: JugadorRemoto) {

    },
    jugador_confirma_posicion: function (jugador: JugadorRemoto) {
        jugador.setPosicionConfirmada();

        //notificar al controller - si no esta en la etapa de espera

        if (gameController.engine.esperarParticipantes) {
            gameController.engine.esperarParticipantes.onJugadorRemotoConfirma();
        }

    },
    getJugadorFromId: function (id_jugador: number): JugadorRemoto {


        return gameData.listaJugadores
            .find(
                jugador => {
                    return jugador.id === id_jugador;
                }
            )
            ;


    }

};