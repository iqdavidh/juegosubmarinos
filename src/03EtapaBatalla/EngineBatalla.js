//@flow

class EngineBatalla extends AEngine {

    constructor(fnOnContinuar) {
        super(fnOnContinuar);

        this.addEventosMouseAndKeyboard();
        this.posicionEnLaMira = null;

    }

    run() {

        const ctx = this.ctx;
        const jugador = this.jugadorLocal;

        this.isRunning = true;

        let idFrame = null;

        //al estar en modo batalla los submarinos comienzan a cargar cohetes

        let contadorFrames=0;

        const frames = () => {

            if (!this.isRunning) {
                window.cancelAnimationFrame(idFrame);
                return;
            }

            contadorFrames++;

            drawBatallaAllRegions.exe(ctx);
            drawBatallaSubmarinosLocal.exe(ctx);
            drawBatallaContadores.exe(ctx);
            drawBatallaCohetesLocal.exe(ctx, contadorFrames);

            idFrame = window.requestAnimationFrame(frames);

        };

        idFrame = window.requestAnimationFrame(frames);

        // frames();


    }

    addEventosMouseAndKeyboard() {


        let canvas = gameData.canvas;

        canvas.onclick = (event) => {
            this.onMouseClick(event);
        };

        canvas.onmousemove = (event) => {
            this.onMouseMove(event);
        };


    }

    onMouseClick(event) {

        console.log('click');

        const posicionRCC = this.posicionEnLaMira;

        //el evento mouse determina si tenemos posicion o no, si hay click salir si es null
        if (posicionRCC === null) {
            return;
        }

        const jugador = gameData.jugadorLocal;

        //salir si no tiene cohetes
        if (jugador.getNumCohetesReady() === 0) {
            return;
        }


        jugador.lanzaCohete(posicionRCC);


    }

    onMouseMove(event) {


        let posicionRCCuadrante = factoryPosicionRCCuadrante.fromEventMouse(event);

        if (posicionRCCuadrante === null) {
            this.canvas.style.cursor = 'default';
            this.posicionEnLaMira = null;
            return;
        }


        let indexCuadrante = posicionRCCuadrante.getIndexCuadrante();

        //salimos porque nos apuntamos a nosotros mismos
        if (indexCuadrante === 0) {
            this.canvas.style.cursor = 'default';
            this.posicionEnLaMira = null;
            return;
        }
        //salimos porque no hay un jugador en ese cuadrante
        if (gameData.listaJugadores.length < indexCuadrante) {
            this.canvas.style.cursor = 'default';
            this.posicionEnLaMira = null;
            return;
        }


        //guardar que posicion estamos apuntando
        this.posicionEnLaMira = posicionRCCuadrante;
        this.canvas.style.cursor = 'crosshair';

    }


    getSubFromPos(posicionRCCuadrante) {
        let sub = this.jugadorLocal.getListaSubmarinos()
            .find(s => {
                return s.getPosicionRC().r === posicionRCCuadrante.getR() &&
                    s.getPosicionRC().c === posicionRCCuadrante.getC();
            });
        return sub;
    }

}
