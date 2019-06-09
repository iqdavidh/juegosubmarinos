class JugadorRemoto extends AJugador {

    constructor(indexCuadrante) {

        super(indexCuadrante);

        this.numSubmarinos = gameConfig.numSubmarinos;

    }

    onSubmarinoDestruido(): void {
        this.numSubmarinos--;
    }

    getNumSubmarinos(): number {
        return this.numSubmarinos;
    }

    lanzaCohete(indexCuadrante: number, r: number, c: number) {

        //el cohete remoto solo necesito del jugador, alli sle su punto de inicio siempre
        const cohete = new CoheteRemoto(this);

        gameData.listaCohetes.push(cohete);


        let posicionRC = new PosicionRC(r, c);
        let posicionEnLaMira = new PosicionRCCuadrante(indexCuadrante, posicionRC);
        let posicionAbs = posicionEnLaMira.getPosAbs();
        cohete.lanzar(posicionAbs);

        let zonaAtacada = factoryZonaAtacada.exe(posicionEnLaMira, cohete.id, this.id);

        gameData.listaZonasAtacadas.push(zonaAtacada);
    }

}


const factoryJugadorRemoto = {
    fromMsgJugadorIngresa: function (mensaje: MsgJugadorIngresa): JugadorRemoto {

        let numJugador = gameData.listaJugadores.length + 1;

        return new JugadorRemoto(numJugador)
    }
};