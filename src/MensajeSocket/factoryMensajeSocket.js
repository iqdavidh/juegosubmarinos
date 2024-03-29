/* @flow */
const tipoMsgSocket = {
    confirma_posiciones: 'confirma_posiciones',
    lanza_cohete: 'lanza_cohete',
    resultado_ataque: 'resultado_ataque',
};


const factoryMensajeSocket = {
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
    ResultadoAtaque: function (id_jugador: string,  r: number, c: number, isSubmarino: boolean) {

        return {
            token: gameData.tokenRoom,
            id_jugador,
            tipo: tipoMsgSocket.resultado_ataque,
            r,
            c,
            isSubmarino

        }

    }
};