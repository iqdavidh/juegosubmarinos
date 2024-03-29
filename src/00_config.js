/* @flow */

const gameConfig = {
    size: 600,
    deltaSep: 20,
    numSubmarinos: 4,
    numDivisiones: 5,
    wDivision: 2,
    sPrepararCohete:7, /*<------------*/
    velocidadCohete:10,
    sizeCohete:50,
    isAudio:true,
    resources: {
        imgMar: null,
        imgBullet:null ,
        imgTanque:null,
        imgTanqueDest:null,
        imgRocket:null,
        imgExplosion:null
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

let consecutivo=0;

function IDGenerator(token) :string{

    consecutivo++;
    return token + consecutivo.toString();
}


