/* @flow */

class EngineEsperar extends AEngine {

    constructor(fnOnContinuar) {

        super(fnOnContinuar);


    }

    run() {
        const ctx = this.ctx;
        const jugador = this.jugadorLocal;
        const listaJugadores = gameData.listaJugadores;

        this.isRunning = true;

        //Fase 1 oscurecer la ultima vista


        let indexFrame = 0;
        const framesOscurecer = () => {


            let indexBlack = 0;
            indexFrame++;
            indexBlack += 0.02;
            if (indexBlack > 1) {
                indexBlack = 1;
            }



            ctx.fillStyle = `rgba(0,0,0,${indexBlack})`;
            ctx.fillRect(0, 0, gameConfig.size, gameConfig.size);

            if(indexBlack<1){
                window.requestAnimationFrame(framesOscurecer);
            }else{
                ctx.fillStyle = "rgb(0,0,0)";
                ctx.fillRect(0, 0, gameConfig.size, gameConfig.size);
            }
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

        framesOscurecer();

    }
}