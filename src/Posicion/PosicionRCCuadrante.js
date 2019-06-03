class PosicionRCCuadrante {

    constructor(indexCuadrante: number, posicionRC: PosicionRC) {
        this.indexCuadrante = indexCuadrante;
        this.posicionRC = posicionRC;
    }

    getIndexCuadrante() {
        return this.indexCuadrante;
    }

    getR() {
        return this.posicionRC.r;
    }

    getC() {
        return this.posicionRC.c;
    }

    toString(){
        return `cuad:${this.indexCuadrante} c:${this.posicionRC.c} r: ${this.posicionRC.r}`;
    }
}

const factoryPosicionRCCuadrante = {
    fromXY: function (x, y) {

        //paso 1 determinar el cuadrante
        const sizeRegion = gameConfig.size / 3;
        const delta = gameConfig.deltaSep;

        function getPosicionCuadrante(valor) {
            return Math.floor(valor / sizeRegion);
        }

        let cuadranteX = getPosicionCuadrante(x);
        let cuadranteY = getPosicionCuadrante(y);

        let code = `${cuadranteX}-${cuadranteY}`;

        let indexCuadrante = this.dicCuadranteIndex[code];

        let origenCuadrante = this.getOrigenCuadrante(indexCuadrante);

        //obtener rango del mar
        let xMarIni = origenCuadrante.x + delta;
        let xMarFin = origenCuadrante.x + sizeRegion - delta;

        let yMarIni = origenCuadrante.y + delta;
        let yMarFin = origenCuadrante.y + sizeRegion - delta;



        if (x >= xMarIni && x <= xMarFin && y >= yMarIni && y <= yMarFin) {

            //encontrar la posicion RC
            let xRel = x - xMarIni;
            let yRel = y - yMarIni;
            let sizeCM = gameCacheSize.getSizeCM();

            let c = 1 + Math.floor(xRel / sizeCM);
            let r = 1 + Math.floor(yRel / sizeCM);
            let posicionRC = new PosicionRC(r, c);
            return new PosicionRCCuadrante(indexCuadrante, posicionRC);

        } else {
            return null;
        }
    },

    dicCuadranteIndex: {
        '0-0': 5,
        '0-1': 2,
        '0-2': 7,
        '1-0': 1,
        '1-1': 0,
        '1-2': 4,
        '2-0': 6,
        '2-1': 3,
        '2-2': 8,
    },
    getOrigenCuadrante(cuadrante: number) {

        const sizeRegion =  gameCacheSize.getSizeRegion();

        if (cuadrante === 5) {
            return new Posicion(0, 0);
        } else if (cuadrante === 1) {
            return new Posicion(sizeRegion, 0);
        } else if (cuadrante === 6) {
            return new Posicion(sizeRegion * 2, 0);
        }

        if (cuadrante === 2) {
            return new Posicion(0, sizeRegion);
        } else if (cuadrante === 0) {
            return new Posicion(sizeRegion, sizeRegion);
        } else if (cuadrante === 3) {
            return new Posicion(sizeRegion * 2, sizeRegion);
        }


        if (cuadrante === 7) {
            return new Posicion(0, sizeRegion * 2);
        } else if (cuadrante === 4) {
            return new Posicion(sizeRegion, sizeRegion * 2);
        } else if (cuadrante === 8) {
            return new Posicion(sizeRegion * 2, sizeRegion * 2);
        }

        throw new Error("Ese cuadrante no esta soportado " + cuadrante.toString());
    }


};