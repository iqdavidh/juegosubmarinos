/* @flow */

type MsgJugadorIngresa = {
    id_jugador: string,
    token: string
};

type MsgJugadorSale = {
    id_jugador: string,
    token: string
};

type MsgJugadorConfirma = {
    id_jugador: string,
    token: string
};


type MsgIniciarBatalla = {
    id_jugador: string,
    token: string
};


type MsgLanzarCohete = {
    id_jugador: string,
    token: string
};


type MsgResultadoAtaque = {
    id_jugador: string,
    token: string
};


type MsgRendicion = {
    id_jugador: string,
    token: string
};

type MsgTerminoBatalla = {
    id_jugador: string,
    token: string
};

const factoryMensajeSocket = {
    JugadorIngresa: function (token, id_jugador) : MensajeJugadorIngresa {
        return {
            id_jugador: id_jugador,
            token: token
        };
    }
};