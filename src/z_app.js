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
    isResourcesLoaded:false,
    isCanvasLoaded:false
};



loadCanvasAndResources( (imgMar)=>{
    gameConfig.resources.imgMar = imgMar;
});






const gameController = {

    onRegistroSocket: function (token) {
        gameData.tokenRoom = token;
        gameData.jugadorLocal = factoryJugador.local();

        this.start()
    },
    start: function () {

        if (gameData.isResourcesLoaded) {
            this.runConfirmarPosiciones();

        } else {

            loadCanvasAndResources( (imgMar)=>{
                gameConfig.resources.imgMar = imgMar;
                this.runConfirmarPosiciones();
            });

        }
    },
    runConfirmarPosiciones: function () {

        gameData.estado = gameEstado.ConfirmarPosicion;

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