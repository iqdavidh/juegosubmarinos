class JugadorRemoto extends AJugador{

    constructor(indexCuadrante) {

        super(indexCuadrante);

        this.numSubmarinos= gameConfig.numSubmarinos;

    }

    getNumSubmarinos(){
        return this.numSubmarinos;
    }
}