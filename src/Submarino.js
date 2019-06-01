export class Submarino {
    constructor(posicionRC , jugador) {
        this.posicionRC=posicionRC;
        this.isActivo=true;
        this.isCoheteListo=false;
        this.jugador=jugar;
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