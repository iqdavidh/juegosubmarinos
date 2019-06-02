class Submarino {

    constructor(posicionRC , jugador) {
        this.posicionRC=posicionRC;
        this.isActivo=true;
        this.isCoheteListo=false;
        this.jugador=jugador;
    }

    getPosicionRC(){
        return this.posicionRC;
    }

    recibeImpacto(){
        this.isActivo=false;
        this.isCoheteListo=false;
    }

    lanzaCohete(fnCB){

    }

}