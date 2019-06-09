/* @flow */
const tipoMsgSocket = {
    ingresa: 'ingresa',
    sale: 'sale',
    confirma_posiciones: 'confirma_posiciones',
    inicia_batalla: 'inicia_batalla',
    lanza_cohete: 'lanza_cohete',
    resultado_ataque: 'resultado_ataque',
};


const factoryMensajeSocket = {
    JugadorIngresa: function (id_jugador: string) {
        return {
            token: gameData.tokenRoom,
            id_jugador,
            tipo: tipoMsgSocket.ingresa
        };
    },
    JugadorConfirma: function (id_jugador: string) {
        return {
            token: gameData.tokenRoom,
            id_jugador,
            tipo: tipoMsgSocket.confirma_posiciones
        }
    },
    LanzaCohete: function (id_jugador: string, id_jugador_recibe_ataque: string, r: number, c: number) {

        return {
            token: gameData.tokenRoom,
            id_jugador,
            id_jugador_recibe_ataque,
            tipo: tipoMsgSocket.lanza_cohete,
            r,
            c
        }

    },
    ResultadoAtaque: function (id_jugador: string, indexCuadrante: number, r: number, c: number, is_submarino: boolean, is_rendicion: boolean) {

        return {
            token: gameData.tokenRoom,
            id_jugador,
            tipo: tipoMsgSocket.resultado_ataque,
            r,
            c,
            is_submarino,
            is_rendicion
        }

    }
};