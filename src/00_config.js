/* @flow */

const gameConfig = {
    size: 700,
    deltaSep: 20,
    numSubmarinos: 8,
    numDivisiones: 6,
    wDivision: 2,
    resources: {
        imgMar: null
    }
};

const gameEstado = {
    ConfirmarPosicion: 'ConfirmarPosicion',
    EsperarParticipantes: 'EsperarParticipantes',
    Batalla: 'Batalla',
    TerminoBatalla: 'TerminoBatalla'
};

const gameCacheSize = {
    sizeRegion: null,
    getSizeRegion: function () {
        if (this.sizeRegion !== null) {
            return this.sizeRegion;
        }

        this.sizeRegion = gameConfig.size / 3;
        return this.sizeRegion;
    },

    sizeMar: null,
    getSizeMar: function () {
        if (this.sizeMar !== null) {
            return this.sizeMar;
        }
        const delta = gameConfig.deltaSep;
        this.sizeMar = this.getSizeRegion() - 2 * delta;
        return this.sizeMar;
    },
    sizeCM: null,
    getSizeCM: function () {

        if (this.sizeCM !== null) {
            return this.sizeCM;
        }

        const s = this.getSizeMar();
        const w = gameConfig.wDivision;

        this.sizeCM = (s - (gameConfig.numDivisiones - 1) * w) / gameConfig.numDivisiones;
        return this.sizeCM;
    }
};


function IDGenerator() {

    let length = 8;
    let timestamp = new Date;

    let _getRandomInt = function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    let ts = timestamp.toString();
    let parts = ts.split("").reverse();
    let id = "";

    for (let i = 0; i < length; ++i) {
        let index = _getRandomInt(0, parts.length - 1);
        id += parts[index];
    }

    return id;
}


