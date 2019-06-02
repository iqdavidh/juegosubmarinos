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




            //this.ctx.drawImage(imgMar, 0, 0)
            console.log('imagen cargada');

        });

    },
    canvas: null,
    ctx: null
};

// esto no debe ejecutarse por
