'use strict';

/**
 * Created by David on 01/06/2019.
 */

let game= {

    start:function(){
        this.canvas=document.createElement('canvas');
        this.canvas.width = 800;
        this.canvas.height = 600;


        this.body=document.getElementById('body');
        this.body.append(this.canvas);
    },
    canvas:null,
    ctx:null,
    getBody:function(){
        return this.body;
    }

};

game.start();