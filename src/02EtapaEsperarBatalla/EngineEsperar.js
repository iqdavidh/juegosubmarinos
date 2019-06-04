/* @flow */

class EngineEsperar extends AEngine{

    constructor(fnOnContinuar){

        super(fnOnContinuar);


    }

    run(){
        const ctx = this.ctx;
        const jugador = this.jugadorLocal;

        this.mouseEstatus = 'select';
        this.isRunning = true;

        const frames = () => {

            // drawSelPos.local(ctx, jugador);
            //
            //
            // if (this.posicionOnDrag !== null) {
            //     let p = this.posicionOnDrag;
            //     drawSelPos.drawDragSubmarino(ctx, p);
            // }
            //
            // if (this.isRunning) {
            //     window.requestAnimationFrame(frames);
            // }


        };

        frames();

    }
}