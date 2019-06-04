/* @flow */
const factoryMensajeSocket = {
    JugadorIngresa : function (token,id){
        return {
            token:token,
            id_jugador:id,
        };
    }
};