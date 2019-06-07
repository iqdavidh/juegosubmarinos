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


    prepararCohete(): void {

        if (this.cohete === null) {
            const intervalo = gameConfig.msPrepararCohete / 6;
            this.avancePrepararCohete = 0;

            let fn = () => {
                this.avancePrepararCohete += 10;

                if (this.avancePrepararCohete >= 100) {
                    // this.cohete = fact
                }
            }


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
