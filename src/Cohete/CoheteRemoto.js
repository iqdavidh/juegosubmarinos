//@flow
"use strict";

class CoheteRemoto extends ACohete {


    constructor(jugador: JugadorRemoto) {

        //poner del origen en el centro del mar

        const origen=factoryPosicionRCCuadrante.getOrigenCuadrante(jugador.indexCuadrante);

        origen.x+=gameCacheSize.getSizeRegion()/2;
        origen.y+=gameCacheSize.getSizeRegion()/2;



        super(origen, jugador.id , jugador.indexCuadrante);


        //inmediatametne se cra se lanza


        this.callbackAlLanzar = () => {
            console.log(`player ataca id_cohete ${this.id}, el jugador es ${this.id}`);
        }

    }

}

