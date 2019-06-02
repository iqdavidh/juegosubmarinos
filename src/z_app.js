'use strict';

let gameLoader = {

    start: function () {
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


            let jugador = new Jugador( 0, lista);
            //this.ctx.drawImage(imgMar, 0, 0)
            console.log('imagen cargada');

        });

    },
    canvas: null,
    ctx: null
};

gameLoader.start();