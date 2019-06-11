//@flow
"use strict";

class CoheteRemoto extends ACohete {


    constructor(jugador: JugadorRemoto) {

        //poner del origen en el centro del mar

        const origen = factoryPosicionRCCuadrante.getOrigenCuadrante(jugador.indexCuadrante);

        origen.x += gameCacheSize.getSizeRegion() / 2;
        origen.y += gameCacheSize.getSizeRegion() / 2;


        super(origen, jugador.id, jugador.indexCuadrante);
        this.isLocal = false;

        //inmediatametne se cra se lanza


        this.callbackAlLanzar = () => {
            console.log(`player ataca id_cohete ${this.id}, el jugador es ${this.id}`);
        };


        this.callbackAlExplotar = (zona: Object) => {


            //este procedimeinto tiene la funcion de evaluar si el coehte remoto alcanzo un submarino local

            if (zona.indexCuadrante !== 0) {
                //si no es una zona del jugador local salimos
                return;
            }


            //buscamos si alcanzaron un submarino local ---------------------------------

            let rZona = zona.posicionRCC.posicionRC.r;
            let cZona = zona.posicionRCC.posicionRC.c;


            let submarino = gameData.jugadorLocal.listaSubmarinos
                .find(s => {
                    return s.posicionRC.r === rZona && s.posicionRC.c === cZona;
                });


            if (submarino) {
                //esta en un submarino debemnos de poner estado como explotado

                gameAudio.getInstance().explosion();

                //TODO mandar mensaje al sockete de que nos destruyeron un submarino


                submarino.isActivo = false;
                //buscar si el submarino tiene un cohete ready y quitarlos
                let coheteLocal = gameData.jugadorLocal.listaCohetes
                    .find(c => {
                        return c.id_submarino === submarino.id && c.getIsEstadoReady();
                    });

                if (coheteLocal) {
                    coheteLocal.estado = 'explotado';
                }

                zona.isSubmarino = true;

            } else {
                zona.isSubmarino = false;
            }



            let  numSubActivos= gameData.jugadorLocal.listaSubmarinos
                .filter(s=>{
                    return s.getIsActivo();
                }).length;





            /*Enviar mesnaje de resultado de ataque ****************** */

            appController.enviarMensajeResultadoDeAtaque(  rZona, cZona,  zona.isSubmarino);

            /*--------------------------------------------- */

            if(numSubActivos===0){
                alert('Perdiste');
            }

        };

    }

}

