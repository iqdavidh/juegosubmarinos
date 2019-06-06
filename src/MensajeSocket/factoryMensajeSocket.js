/* @flow */
const tipoMsgSocket = {
    ingresa: 'ingresa',
    sale:'sale',
    confirma_posiciones:'confirma_posiciones',
    inicia_batalla:'inicia_batalla',
    lanza_cohete:'lanza_cohete',
    resultado_ataque:'resultado_ataque',
};


const factoryMensajeSocket = {
    JugadorIngresa: function (token, id_jugador): MsgJugadorIngresa {
        return {
            id_jugador,
            token,
            tipo: tipoMsgSocket.ingresa
        };
    },
    JugadorConfirma: function (token, id_jugador): MsgJugadorConfirma {
        return {
            id_jugador,
            token,
            tipo: tipoMsgSocket.confirma_posiciones
        }
    }
};