'use strict';
//@flow

const gameData = {
    tokenRoom: null,
    canvas: null,
    ctx: null,
    jugadorLocal: null,
    listaJugadores: [],
    listaCohetes: [],
    listaMsgSocket: [],
    estado: null,
    listaZonasAtacadas:[],
    isResourcesLoaded: false,
    isCanvasLoaded: false
};

//cargar canvas ************************************************

(function () {

    gameData.canvas = document.createElement('canvas');
    gameData.canvas.width = gameConfig.size;
    gameData.canvas.height = gameConfig.size;

    // gameData.canvas.style.width = gameConfig.size;
    // gameData.canvas.style.height = gameConfig.size;

    let container = document.getElementById('panCanvas');
    container.append(gameData.canvas);
    gameData.ctx = gameData.canvas.getContext('2d');

    gameData.isCanvasLoaded = true;
    console.log('canvas loaded');

})();









const gameController = {

    engine: {
        selpos: null,
        esperarParticipantes: null,
        batalla: null
    },
    onRegistroSocket: function (token) {

        gameData.tokenRoom = token;
        gameData.jugadorLocal = factoryJugador.local();

        this.start()
    },
    start: function () {

        if (gameConfig.isResourcesLoaded) {
            this.runConfirmarPosiciones();
        }else{
            console.log('isResourcesLoaded false - nos e pueden confirmar posiciones');
        }
    },
    runConfirmarPosiciones: function () {

        console.log('runConfirmarPosiciones');
        gameData.estado = gameEstado.ConfirmarPosicion;

        let fnOnConfirmar = () => {
            gameController.runEsperarParticipantes();

            this.engine.selpos = null;
        };

        this.engine.selpos = new EngineSelPos(fnOnConfirmar);
        this.engine.selpos.run();

    },
    runEsperarParticipantes: function () {

        console.log('runEsperarParticipantes');
        gameData.estado = gameEstado.EsperarParticipantes;

        let fnOnContinuar = () => {

            this.engine.esperarParticipantes = null;
            gameData.ctx.fillStyle = `rgb(0, 0, 0)`;
            gameData.ctx.fillRect(0, 0, gameConfig.size, gameConfig.size);
            gameController.runBatalla();
        };

        this.engine.esperarParticipantes = new EngineEsperar(fnOnContinuar);
        this.engine.esperarParticipantes.run();

    },
    runBatalla: async function () {
        console.log('runBatalla');
        gameData.estado = gameEstado.Batalla;

        gameAudio.getInstance().startBG();

        let fnOnContinuar = () => {


            this.engine.esperarParticipantes = null;

            gameData.ctx.fillStyle = `rgb(0, 0, 0)`;
            gameData.ctx.fillRect(0, 0, gameConfig.size, gameConfig.size);

            gameController.runTerminoBatalla();


        };

        let pausa = await setTimeout(() => {
            return true;
        }, 2000);

        gameReloj.start();
        let engine = new EngineBatalla(fnOnContinuar);
        this.engine.batalla = engine;

        engine.run();

    },
    runTerminoBatalla: function () {
        gameData.estado = gameEstado.TerminoBatalla;
        console.log('batalla terminada');
    },
    onRecibirMensajeSocket: function (msg) {
        proRecibirMsgSocket.exe(msg);
    },
    onEnviarMensajeSocket: function (msg) {

        //TODO enviar mensaje de confirmar
    }


};