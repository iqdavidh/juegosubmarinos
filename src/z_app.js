'use strict';

let engineSelPos = null;

let gameData = {
    tokenRoom:null,
    canvas: null,
    ctx: null,
    jugadorLocal: [],
    listaJugadores:[],
    listaCohetes:[],
    listaMsgSocket:[]
};

let gameLoader = {

    canvas: null,
    ctx: null,
    start: async function (tokenRoom) {

        gameData.canvas = document.createElement('canvas');
        gameData.canvas.width = gameConfig.size;
        gameData.canvas.height = gameConfig.size;

        let container = document.getElementById('container');
        container.append(gameData.canvas);
        gameData.ctx = gameData.canvas.getContext('2d');

        Promise.all([
                loadBGMar()
            ]
        ).then(([imgMar]) => {
            //guardar los archivos cargados
            gameConfig.resources.imgMar = imgMar;

            this.runConfirmarPosiciones(tokenRoom);
        });

    },
    runConfirmarPosiciones:  function (tokenRoom) {

        gameData.tokenRoom = tokenRoom;
        gameData.jugadorLocal = factoryJugador.local();



        engineSelPos = new EngineSelPos();
        engineSelPos.run();

        return true;

    }

};