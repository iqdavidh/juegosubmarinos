//@flow
"use strict";

class CoheteLocal extends ACohete {

    constructor(posicionIni: Posicion, id_jugador: string, id_submarino: string) {
        super(posicionIni, id_jugador);

        this.id_submarino = id_submarino;

        this.callbackAlLanzar = () => {

            console.log( `id ${this.id} coehte lanzado , el submarino es ${this.id_submarino}`);

            // al lanzar vamos a buscar al submarino que es dueño de  este cohete poara volverlo a mandar
            let submarino = gameData.jugadorLocal.getListaSubmarinos()
                .find(s => {
                    return s.id=this.id_submarino;
                })
            ;

            if(submarino){
                console.log(`preparar submarino ${id_submarino}`);
                submarino.prepararCohete();
            }


        }

    }

}

const factoryCohete = {
    jugadorLocal: function (submarino: Submarino) {

        //let posicion= submarino.

        let jugador = gameData.jugadorLocal;

        let origen = jugador.getOrigenFromIndex();
        let posRel = submarino.getPosicionXYRel();

        const sizeCM = gameCacheSize.getSizeCM();

        let x = origen.x + posRel.x + sizeCM / 2;
        let y = origen.y + posRel.y + sizeCM / 2;

        let posicionCentroCohete = new Posicion(x, y);


        return new CoheteLocal(posicionCentroCohete, jugador.id, submarino.id);


    }
};

