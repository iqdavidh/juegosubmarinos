'use strict';

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


loadCanvasAndResources((imgMar) => {
    gameConfig.resources.imgMar = imgMar;
});


const gameController = {

    engine: {
        selpos: null,
        esperarParticipantes: null
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

            loadCanvasAndResources((imgMar) => {
                gameConfig.resources.imgMar = imgMar;
                this.runConfirmarPosiciones();
            });

        }
    },
    runConfirmarPosiciones: function () {

        gameData.estado = gameEstado.ConfirmarPosicion;

        let fnOnConfirmar = () => {
            gameController.runEsperarParticipantes();

            this.engine.selpos = null;
        };

        this.engine.selpos = new EngineSelPos(fnOnConfirmar);
        this.engine.selpos.run();

    },
    runEsperarParticipantes: function () {


        gameData.estado = gameEstado.EsperarParticipantes;

        let fnOnContinuar = () => {
            function frame(){
                gameData.ctx.fillStyle = `rgb(0, 0, 0)`;
                gameData.ctx.fillRect(0, 0, gameConfig.size, gameConfig.size);
            }
            window.requestAnimationFrame(frame);


            gameController.runBatalla();

            this.engine.esperarParticipantes = null;
        };

        this.engine.esperarParticipantes = new EngineEsperar(fnOnContinuar);
        this.engine.esperarParticipantes.run();
    },
    runBatalla: function () {
        gameData.estado = gameEstado.Batalla;
        console.log('ya esta inicaida la batalla');
    },
    onRecibirMensajeSocket: function (msg) {
        proRecibirMsgSocket.exe(msg);
    },
    onEnviarMensajeSocket: function (msg) {

        //TODO enviar mensaje de confirmar
    }


};