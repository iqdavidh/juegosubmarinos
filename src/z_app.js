'use strict';

let gameEngine=null;

let gameLoader = {

    canvas: null,
    ctx: null,
    start: function () {

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
            this.reload();
        });

    },
    reload:function(){

        let jugadorLocal=factoryJugador.local();

        gameEngine=new GameEngine( jugadorLocal);
    }

};


