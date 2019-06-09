/* @flow */

const proRecibirMsgSocket = {
    exe: function (msg) {

        const jugador = this.getJugadorFromId(msg.id_jugador);

        if (msg.tipo === tipoMsgSocket.ingresa) {
            this.jugador_ingresa(jugador);


        } else if (msg.tipo === tipoMsgSocket.confirma_posiciones) {
            this.jugador_confirma_posicion(jugador)

        } else if (msg.tipo === tipoMsgSocket.lanza_cohete) {
            this.lanza_cohete(msg)

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
    lanza_cohete: function (msg) {

        //si es el mensaje del jugador local no hacemos nada
        if (msg.id_jugador === gameData.jugadorLocal.id) {
            return;
        }

        let indexCuadranteAtacado = null;

        if (msg.id_jugador_recibe_ataque === gameData.jugadorLocal.id) {
            indexCuadranteAtacado = 0;
        } else {
            //buscar que cuadrante tiene ese jugador
            let jugadorAtacado = gameData.listaJugadores
                .find(j => {
                    return j.id === msg.id_jugador_recibe_ataque;
                })
            ;

            if (jugadorAtacado) {
                indexCuadranteAtacado = jugadorAtacado.getIndexCuadrante();
            }
        }

        if (indexCuadranteAtacado!== null) {
            gameController.engine.batalla.onJugadorRemotoLanzaCohete(msg.id_jugador, indexCuadranteAtacado, msg.r, msg.c);
        }


    },
    getJugadorFromId: function (id_jugador: string): JugadorRemoto {


        return gameData.listaJugadores
            .find(
                jugador => {
                    return jugador.id === id_jugador;
                }
            )
            ;


    }

};