//@flow

class Submarino {

    constructor(posicionRC) {

        this.id = IDGenerator();
        this.isOnDrag = false;
        this.posicionRC = posicionRC;
        this.isActivo = true;

        this.jugador = null;

        this.avancePrepararCohete = 0;
        this.isPrimerDraw = true;


    }

    getJugador() {
        return this.jugador();
    }

    setJugador(jugador) {
        this.jugador = jugador;

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


    lanzaCohete(): void {

    }

    prepararCohete(): void {


        const numIntervalos = 6;
        const intervalo = this.isPrimerDraw ? 100 : gameConfig.msPrepararCohete / numIntervalos;
        this.avancePrepararCohete = 0;

        let idInterval = null;

        let fn = () => {

            this.avancePrepararCohete++;

            console.log(`sub ${this.id}, paso ${this.avancePrepararCohete}`);
            if (this.avancePrepararCohete >= numIntervalos) {

                console.log(`sub ${this.id} terminado`);

                window.clearInterval(idInterval);
                const cohete = factoryCohete.jugadorLocal(this);
                console.log(`cohete creado es ${cohete.id} del sub ${ cohete.id_submarino}`)
                gameData.jugadorLocal.listaCohetes.push(cohete);

            }
        };


        //ponermos el intervalo al inicio mmuy corto para tener cohetes disponiles

        idInterval = window.setInterval(fn, intervalo);

        this.isPrimerDraw = false;

    }


}


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
