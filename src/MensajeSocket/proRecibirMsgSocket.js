/* @flow */

const proRecibirMsgSocket = {
    exe: function (data) {

        const jugador=this.getJugadorFromId( parseInt( data.id_jugador ));

        if (data.tipo === tipoMsgSocket.ingresa) {
            this.jugador_ingresa(jugador);


        } else if (data.tipo === tipoMsgSocket.confirma_posiciones) {
            this.jugador_confirma_posicion(jugador)

        } else {
            alert("no esperamos este tipo de mensaje " + data.tipo)
        }


    },
    jugador_ingresa: function ( jugador: JugadorRemoto) {

    },
    jugador_confirma_posicion: function ( jugador: JugadorRemoto) {
        jugador.setPosicionConfirmada();

        //notificar al controller
        gameController.engine.esperarParticipantes.onJugadorRemotoConfirma();
    },
    getJugadorFromId: function (id_jugador : number) : JugadorRemoto {


        return gameData.listaJugadores
            .find(
                jugador => {
                    return jugador.id === id_jugador;
                }
            )
        ;


    }

};