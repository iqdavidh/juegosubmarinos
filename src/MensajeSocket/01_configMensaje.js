//@flow

const configTipoMensaje = {
    JugadorIngresa:'JugadorIngresa',
    JugadorSale:'JugadorSale',
    IniciarBatalla: 'IniciarBatalla',
    LanzarCohete:'LanzarCohete',
    ResultadoAtaque:'ResultadoAtaque',
    Rendicion:'Rendicion',
    TerminoBatalla:'TerminoBatalla'
};


type MsgJugadorIngresa = {
    id_jugador: string,
    token: string,
    tipo: string
};

type MsgJugadorSale = {
    id_jugador: string,
    token: string,
    tipo: string
};

type MsgJugadorConfirma = {
    id_jugador: string,
    token: string,
    tipo: string
};


type MsgIniciarBatalla = {
    id_jugador: string,
    token: string,
    tipo: string
};


type MsgLanzarCohete = {
    id_jugador: string,
    token: string,
    tipo: string
};


type MsgResultadoAtaque = {
    id_jugador: string,
    token: string,
    tipo: string
};


type MsgRendicion = {
    id_jugador: string,
    token: string,
    tipo: string
};

type MsgTerminoBatalla = {
    id_jugador: string,
    token: string,
    tipo: string
};

