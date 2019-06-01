'use strict';

import {loadBGMar} from "./loaders.js";
import {gameConfig} from "./gameConfig.js";

/**
 * Created by David on 01/06/2019.
 */



let game = {

    start: function () {
        this.canvas = document.createElement('canvas');
        this.canvas.width = gameConfig.size;
        this.canvas.height = gameConfig.size;


        this.body = document.getElementById('body');
        this.body.append(this.canvas);
        this.ctx = this.canvas.getContext('2d');


        Promise.all([
                loadBGMar()
            ]
        ).then(([imgMar]) => {

            this.ctx.drawImage(imgMar, 0, 0)

        });


    },
    canvas: null,
    ctx: null,
    getBody: function () {
        return this.body;
    }

};

game.start();