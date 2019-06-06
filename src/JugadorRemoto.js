class JugadorRemoto extends AJugador {

    constructor(indexCuadrante) {

        super(indexCuadrante);

        this.numSubmarinos = gameConfig.numSubmarinos;

    }

    getNumSubmarinos() {
        return this.numSubmarinos;
    }


}


const factoryJugadorRemoto = {
    fromMsgJugadorIngresa: function (mensaje: MsgJugadorIngresa): JugadorRemoto {

        let numJugador=gameData.listaJugadores.length +1 ;

        return new JugadorRemoto(numJugador)
    }
};