//@flow
"use strict";

class Submarino {

    constructor(posicionRC) {

        this.id = IDGenerator('s');
        this.isOnDrag = false;
        this.posicionRC = posicionRC;
        this.isActivo = true;

        /* al copsntruise se les da 1 segundo para preparar los cohetes*/
        this.tiempoCoheteReady=gameReloj.tiempo + 1;
    }

    getIsActivo(){
        return this.isActivo;
    }



    getPosicionRC(): PosicionRC {
        return this.posicionRC;
    }

    /**Posicion relativa a la region/cuadrante*/
    getPosicionXYRel(): Posicion {
        const delta = gameConfig.deltaSep;
        const sizeCM = gameCacheSize.getSizeCM();

        const x = (this.getPosicionRC().c - 1) * (sizeCM + gameConfig.wDivision) + delta;
        const y = (this.getPosicionRC().r - 1) * (sizeCM + gameConfig.wDivision) + delta;

        return new Posicion(x, y);
    }

    recibeImpacto() {
        this.isActivo = false;
    }

    ResetTiempoCoheteReady():void{
        this.tiempoCoheteReady=0;
    }

    setNewTiempoCoheteReady(): void {
        this.tiempoCoheteReady=gameReloj.getTiempo()+gameConfig.sPrepararCohete;
    }

    ToString(){
        return `sub id:${this.id}, activo:${this.isActivo?'si':'no'},tiempoCoheteReady:${this.tiempoCoheteReady} `;
    }
}


//esto lo uso para crear los cohetes

const factoryListaSubmarinos = {

    random: function () {

        let lista = [];


        while (lista.length < gameConfig.numSubmarinos) {
            //agregar submarino


            let r = 1 + Math.floor(Math.random() * (gameConfig.numDivisiones));
            let c = 1 + Math.floor(Math.random() * (gameConfig.numDivisiones));

            //buscar si se repiten

            let numCoincidencias = lista
                .filter(item => {
                    return item.posicionRC.r === r && item.posicionRC.c === c;
                })
                .length
            ;

            if (numCoincidencias === 0) {

                let posicionRC = new PosicionRC(r, c);
                let submarino = new Submarino(posicionRC);
                lista.push(submarino);
            }

        }


        return lista;
    }
};
