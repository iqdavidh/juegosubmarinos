class PosicionRCCuadrante {

    constructor(indexCuadrante: number, posicion: PosicionRC) {
        this.indexCuadrante = indexCuadrante;
        this.posicion = posicion;
    }

    getIndexCuadrante() {
        return this.indexCuadrante;
    }

    getR() {
        return this.posicion.r;
    }

    getC() {
        return this.posicion.c;
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

            return new PosicionRCCuadrante(indexCuadrante);

        } else {
            return null;
        }
    },

    dicCuadranteIndex: {
        '00': 5,
        '01': 1,
        '02': 6,
        '10': 2,
        '11': 0,
        '12': 3,
        '20': 7,
        '21': 4,
        '22': 8,
    },
    getOrigenCuadrante(cuadrante: number) {

        const sizeRegion = gameConfig.size / 3;

        if (index === 5) {
            return new Posicion(0, 0);
        } else if (index === 1) {
            return new Posicion(sizeRegion, 0);
        } else if (index === 6) {
            return new Posicion(sizeRegion * 2, 0);
        }

        if (index === 2) {
            return new Posicion(0, sizeRegion);
        } else if (index === 0) {
            return new Posicion(sizeRegion, sizeRegion);
        } else if (index === 3) {
            return new Posicion(sizeRegion * 2, sizeRegion);
        }


        if (index === 7) {
            return new Posicion(0, sizeRegion * 2);
        } else if (index === 4) {
            return new Posicion(sizeRegion, sizeRegion * 2);
        } else if (index === 8) {
            return new Posicion(sizeRegion * 2, sizeRegion * 2);
        }

        throw new Error("Ese cuadrante no esta soportado " + cuadrante.toString());
    }


};