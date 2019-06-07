//@flow

class EngineBatalla extends AEngine{

    constructor(fnOnContinuar){
        super(fnOnContinuar);

        this.addEventosMouseAndKeyboard();

    }


    run() {
        const ctx = this.ctx;
        const jugador = this.jugadorLocal;

        this.isRunning = true;

        let idFrame = null;

        //al estar en modo batalla los submarinos comienzan a cargar cohetes

        jugador.prepararCohetes();

        const frames = () => {

            if (!this.isRunning) {
                window.cancelAnimationFrame(idFrame);
                return;
            }

            drawBatallaAllRegions.exe(ctx);
            drawBatallaSubmarinosLocal.exe(ctx);

            //idFrame = window.requestAnimationFrame(frames);

        };

        //idFrame = window.requestAnimationFrame(frames);

        frames();


    }

    addEventosMouseAndKeyboard() {

        return;

        let canvas = gameData.canvas;

        canvas.onmouseclick = (event) => {
            this.onMouseClick(event);
        };

        canvas.onmousemove = (event) => {
            this.onMouseMove(event);
        };


    }

    onMouseClick(event) {


        return ;

        let posicionRCCuadrante = factoryPosicionRCCuadrante.fromEventMouse(event);

        if (posicionRCCuadrante === null) {
            return;
        }

        if (posicionRCCuadrante.getIndexCuadrante() === 0) {
            //salimos si nos apuntamos a nosotros mismos
            return;
        }


        //buscar la posicion en la lista de posiciones atacadas y salir sio ya fue atacada



        let idSub = sub.id;
        this.jugadorLocal.getListaSubmarinos()
            .forEach(s => {
                s.isOnDrag = s.id === idSub;
            });


        //guardar la posicion
        this.posicionOnDrag = posicionRCCuadrante;

    }

    onMouseMove(event) {

        let posicionRCCuadrante = factoryPosicionRCCuadrante.fromEventMouse(event);

        if (posicionRCCuadrante.getIndexCuadrante() === 0) {
            //salimos porque nos apuntamos a nosotros mismos
            this.canvas.style.cursor = 'default';
            return;

        }

        //solo cambiar el cu



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
