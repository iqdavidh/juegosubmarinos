'use strict';

let gameEngine = null;

let gameLoader = {

    canvas: null,
    ctx: null,
    start: function (tokenRoom) {

        if (this.isTerminado) {
            throw new Error("El loader ha termiando")
        }

        this.canvas = document.createElement('canvas');
        this.canvas.width = gameConfig.size;
        this.canvas.height = gameConfig.size;


        let container = document.getElementById('container');
        container.append(this.canvas);
        this.ctx = this.canvas.getContext('2d');

        Promise.all([
                loadBGMar()
            ]
        ).then(([imgMar]) => {
            //guardar los archivos cargados
            gameConfig.resources.imgMar = imgMar;
            this.confirmarPosiciones(tokenRoom);
        });

    },
    confirmarPosiciones: function (tokenRoom) {

        let jugadorLocal = factoryJugador.local();

        gameEngine = new GameEngine(this.ctx, tokenRoom, jugadorLocal);

        //eventos de mouse **************************************
        this.canvas.onmousedown = function (event) {
            gameEngine.onMouseDownEtapaSeleccionarPosicion(event);
        };

        this.canvas.onmouseup = function(event){
            gameEngine.onMouseUpEtapaSeleccionarPosicion(event);
        };

        this.canvas.onmousemove=function(event){
            gameEngine.onMouseMoveEtapaSeleccionarPosicion(event);
        };


        gameEngine.runEtapaSeleccionarPosicion();

    }

};