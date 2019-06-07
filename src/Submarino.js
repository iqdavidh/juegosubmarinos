//@flow

class Submarino {

    constructor(posicionRC) {

        this.id = IDGenerator();
        this.isOnDrag = false;
        this.posicionRC = posicionRC;
        this.isActivo = true;

        this.jugador = null;

        this.cohete = null;
        this.avancePrepararCohete = 0;
        this.isPrimerDraw = true;


    }

    getJugador() {
        return this.jugador();
    }

    setJugador(jugador) {
        this.jugador = jugador;

    }

    getIsCoheteListo(): boolean {
        return this.cohete !== null;
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
        this.isCoheteListo = false;
    }


    lanzaCohete(): void {

    }

    onCoheteListo(cohete: CoheteLocal) {

    }


    prepararCohete(): void {

        if (this.cohete !== null && this.cohete.getIsEstadoReady()) {
            return;
        }

        const numIntervalos = 6;
        const intervalo = this.isPrimerDraw ? 100 : gameConfig.msPrepararCohete / numIntervalos;
        this.avancePrepararCohete = 0;

        let idInterval = null;

        let fn = () => {
            this.avancePrepararCohete++;

            if (this.avancePrepararCohete >= numIntervalos) {

                window.clearInterval(idInterval);
                this.cohete = factoryCohete.jugadorLocal(this);
                gameData.jugadorLocal.listaCohetes.push(this.cohete);

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
