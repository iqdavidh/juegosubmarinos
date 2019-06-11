/* @flow */

const proRecibirMsgSocket = {
    exe: function (msg) {

        //buscar al jugador qeu envia el ataque
        const jugador = this.getJugadorFromId(msg.id_jugador);

        //si es del jugador local / nbosotros msimos no hacemos nada
        if (msg.id_jugador === gameData.jugadorLocal.id) {
            return;
        }

        if (msg.tipo === tipoMsgSocket.confirma_posiciones) {
            this.jugador_confirma_posiciones(jugador)

        } else if (msg.tipo === tipoMsgSocket.lanza_cohete) {
            this.lanza_cohete(msg)

        } else if (msg.tipo === tipoMsgSocket.resultado_ataque) {
            this.resultado_ataque(jugador, msg);

        } else {
            alert("no esperamos este tipo de mensaje " + msg.tipo)
        }


    },

    jugador_confirma_posiciones: function (jugador: JugadorRemoto) {

        jugador.setPosicionConfirmada();

        //notificar al controller - si no esta en la etapa de espera

        if (gameController.engine.esperarParticipantes) {
            gameController.engine.esperarParticipantes.onJugadorRemotoConfirma();
        }

    },
    lanza_cohete: function (msg) {

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

        if (indexCuadranteAtacado !== null) {
            gameController.engine.batalla.onJugadorRemotoLanzaCohete(msg.id_jugador, indexCuadranteAtacado, msg.r, msg.c);
        }


    },
    resultado_ataque: function (jugador: JugadorRemoto, msg) {
        //buscar la zona que se ataco y marcarla

        let zona = gameData.listaZonasAtacadas
            .find(z => {
                    let rZona = z.posicionRCC.posicionRC.r;
                    let cZona = z.posicionRCC.posicionRC.c;

                    return z.id_jugador === jugador.id && msg.r === rZona && msg.c === cZona;
                }
            );


        let isZonaNueva = false;

        if (!zona) {
            //crear la zona

            isZonaNueva = true;

            const indexCuadrante = jugador.getIndexCuadrante();
            const pos = new PosicionRCCuadrante(indexCuadrante, new PosicionRC(msg.r, msg.c));
            zona = factoryZonaAtacada.exe(pos, null, jugador.id);
            gameData.listaZonasAtacadas.push(zona);
        }


        zona.isObjetivoAlcanzado = true;

        if (zona.isSubmarino !== true && msg.isSubmarino) {
            zona.isSubmarino = true;
            jugador.onSubmarinoDestruido();
        } else {
            zona.isSubmarino = msg.isSubmarino;
        }


        //si destruyeon un submarino evaluar si ya ganamos
        if (zona.isSubmarino) {

            //ver cuantos jugadores quedan

            let numJugadores = gameData.listaJugadores
                .filter(j => {
                    return j.getNumSubmarinos() > 0;
                })
                .length
            ;

            if (numJugadores === 0) {
                alert("ganaste");
            }


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