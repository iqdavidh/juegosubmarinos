// @flow

class AEngine {

    constructor(fnOnContinuar){

        this.fnOnContinuar = fnOnContinuar;

        this.isRunning = null;
        this.canvas = gameData.canvas;
        this.ctx = gameData.ctx;
        this.tokenRoom = gameData.tokenRoom;
        this.jugadorLocal = gameData.jugadorLocal;

        this.mouseEstatus = null;
    }

    removeEventosMouseAndKeyBoard() {
        let canvas = gameData.canvas;

        canvas.onmousedown = (event) => {
            // console.log('no listenging');
        };

        canvas.onmouseup = (event) => {
            // console.log('no listenging');
        };

        canvas.onmousemove = (event) => {
            // console.log('no listenging');
        };

        document.onkeydown = (event) => {
            // console.log('no listenging');
        };
    }



}