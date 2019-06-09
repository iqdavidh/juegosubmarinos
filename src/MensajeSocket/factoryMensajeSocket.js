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
    JugadorIngresa: function (token :string, id_jugador :string ) {
        return {
            id_jugador,
            token,
            tipo: tipoMsgSocket.ingresa
        };
    },
    JugadorConfirma: function (token :string, id_jugador : string ) {
        return {
            id_jugador,
            token,
            tipo: tipoMsgSocket.confirma_posiciones
        }
    },
    LanzaCohete :function(  token :string , id_jugador : string,  indexCuadrante :number, r: number, c: number){

        return {
            id_jugador,
            token,
            tipo: tipoMsgSocket.lanza_cohete,
            indexCuadrante : indexCuadrante ,
            r:r,
            c:c
        }

    }
};