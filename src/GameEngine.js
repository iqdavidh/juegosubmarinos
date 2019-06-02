class GameEngine  {

    constructor(jugadorLocal){
        this.listaJugadores=[ jugadorLocal] ;
    }

    addJugador(jugador){
        this.listaJugadores.push(jugador);
    }


}
