/* @flow */

const gameConfig = {
    size: 800,
    deltaSep: 30,
    numSubmarinos: 3,
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
    } ,

    sizeMar: null,
    getSizeMar: function () {
        if (this.sizeMar !== null) {
            return this.sizeMar;
        }
        const delta = gameConfig.deltaSep;
        this.sizeMar = this.getSizeRegion() -  2 * delta;
        return this.sizeMar;
    },
    sizeCM: null,
    getSizeCM: function () {

        if (this.sizeCM !== null) {
            return this.sizeCM;
        }

        this.sizeCM = (this.getSizeMar() - gameConfig.numDivisiones * gameConfig.wDivision) / gameConfig.numDivisiones;
        return this.sizeCM;
    }
};
