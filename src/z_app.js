'use strict';

let gameData = {
    tokenRoom: null,
    canvas: null,
    ctx: null,
    jugadorLocal: [],
    listaJugadores: [],
    listaCohetes: [],
    listaMsgSocket: [],
    estado: null
};

let gameController = {

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
    runConfirmarPosiciones: function (tokenRoom) {

        gameData.estado = gameEstado.ConfirmarPosicion;
        gameData.tokenRoom = tokenRoom;
        gameData.jugadorLocal = factoryJugador.local();


        let fnOnConfirmar = () => {
            gameController.runEsperarParticipantes();
        };

        const engine = new EngineSelPos(fnOnConfirmar);
        engine.run();

    },
    runEsperarParticipantes: function () {

        gameData.estado = gameEstado.EsperarParticipantes;

        let fnOnContinuar = () => {
            gameController.runBatalla();
        };

        const engine = new EngineEsperar(fnOnContinuar);
        engine.run();
    },
    runBatalla: function () {
        gameData.estado = gameEstado.Batalla;
        console.log('ya esta inicaida la batalla');
    },
    onRecibirMensajeSocket: function (tipo, data) {


    },
    onEnviarMensajeSocket: function (tipo, data) {

    }


};