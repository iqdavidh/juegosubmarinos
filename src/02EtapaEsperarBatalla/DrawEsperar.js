/*@flow*/

const drawEsperar = {


    oscurecer: (ctx, fnCallback) => {

        let numPasos = 100;
        let indexFrame = 0;

        let key = null;
        const framesOscurecer = () => {

            indexFrame++;

            ctx.fillStyle = `rgba(0, 0, 0, 0.02)`;
            ctx.fillRect(0, 0, gameConfig.size, gameConfig.size);

            if (indexFrame < numPasos) {
                key = window.requestAnimationFrame(framesOscurecer);
            } else {
                ctx.fillStyle = "rgb(0,0,0)";
                ctx.fillRect(0, 0, gameConfig.size, gameConfig.size);
                window.cancelAnimationFrame(key);
                fnCallback();
            }

        };

        framesOscurecer();

    },


    actualizarTextoEspera: (ctx, numJugadores, numConfirmados) => {

        /* no es una animación solo se pintan los textos despues de poner pondo negro*/

        let idFrame=null;
        /*Fondo negro*/
        function frame(){

            console.log( `jugadore-confirmados ${numJugadores},${numConfirmados}`);
            ctx.fillStyle = `rgb(0, 0, 0)`;
            ctx.fillRect(0, 0, gameConfig.size, gameConfig.size);


            let textoTop = 'Esperando a los demás jugadores';
            //textos
            let texto = `${numConfirmados} de ${numJugadores} han confirmado posiciones`;

            ctx.fillStyle = "rgb(255, 255, 0)";
            ctx.font = '28px monospace';
            ctx.fillText(textoTop, (gameConfig.size - 476) / 2, 150);
            ctx.fillText(texto, (gameConfig.size - 465) / 2, gameConfig.size / 2);

            //window.cancelAnimationFrame(idFrame);
        }

        frame();

    }

};