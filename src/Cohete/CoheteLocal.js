//@flow
"use strict";

class CoheteLocal extends ACohete {

    constructor(posicionIni: Posicion, id_jugador: string, id_submarino: string) {
        super(posicionIni, id_jugador,0);
        this.isLocal=true;

        this.id_submarino = id_submarino;

        this.callbackAlLanzar = () => {

            console.log(`allanzar id_cohete ${this.id}, el submarino es ${this.id_submarino}`);

            // al lanzar vamos a buscar al submarino que es dueño de  este cohete poara volverlo a mandar
            let submarino = gameData.jugadorLocal.getListaSubmarinos()
                .find(s => {
                    return s.id === this.id_submarino;
                })
            ;

            if (submarino) {
                //console.log(`preparar submarino ${id_submarino}`);
                submarino.setNewTiempoCoheteReady();
                //console.log(`nuevo tiempo del submarino ${id_submarino} es ${submarino.tiempoCoheteReady}`);
            }


        }

    }

}

