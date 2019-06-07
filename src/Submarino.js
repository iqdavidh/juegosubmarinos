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


    lanzaCohete(fnCB): void {

    }

    onCoheteListo(cohete: Cohete) {

    }


    prepararCohete(): void {

        if (this.cohete === null) {
            const numIntervalos = 6;
            const intervalo = gameConfig.msPrepararCohete / numIntervalos;
            this.avancePrepararCohete = 0;

            let idInterval = null;

            let fn = () => {
                this.avancePrepararCohete++;

                if (this.avancePrepararCohete >= numIntervalos) {


                    window.clearInterval(idInterval);
                    this.cohete = factoryCohete.jugadorLocal(this);

                    //console.log(`cohete listo ${this.cohete.id}`);

                }
            };

            idInterval = window.setInterval( fn, intervalo);


        }
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
