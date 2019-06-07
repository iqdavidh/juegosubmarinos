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
    isResourcesLoaded: false,
    isCanvasLoaded: false
};


loadCanvasAndResources((imgMar, imgBullet, imgTanque) => {
    gameConfig.resources.imgMar = imgMar;
    gameConfig.resources.imgBullet = imgBullet;
    gameConfig.resources.imgTanque = imgTanque;
});


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

        if (gameData.isResourcesLoaded) {
            this.runConfirmarPosiciones();

        } else {


            //se verifica si estan cargadoir
            loadCanvasAndResources((imgMar, imgBullet, imgTanque) => {
                gameConfig.resources.imgMar = imgMar;
                gameConfig.resources.imgBullet = imgBullet;
                gameConfig.resources.imgTanque = imgTanque;
                this.runConfirmarPosiciones();
            });


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

        let fnOnContinuar = () => {


            this.engine.esperarParticipantes = null;

            gameData.ctx.fillStyle = `rgb(0, 0, 0)`;
            gameData.ctx.fillRect(0, 0, gameConfig.size, gameConfig.size);

            gameController.runTerminoBatalla();


        };

        let pausa = await setTimeout(() => {
            return true;
        }, 2000);

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