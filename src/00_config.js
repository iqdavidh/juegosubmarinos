/* @flow */

const gameConfig = {
    size: 800,
    deltaSep: 30,
    numSubmarinos: 8,
    numDivisiones: 5,
    wDivision: 2,
    resources: {
        imgMar: null
    }
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
