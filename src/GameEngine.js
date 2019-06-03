/* @flow */

class GameEngine {

    constructor(ctx, tokenRoom, jugadorLocal) {

        this.ctx = ctx;
        this.tokenRoom = tokenRoom;
        this.jugadorLocal = jugadorLocal;
        this.listaJugadores = [jugadorLocal];

        this.mouseEstatus = null;

        this.posicionOnDrag = null;
        this.submarinoOnDrag = null;
    }

    addJugador(jugador) {
        this.listaJugadores.push(jugador);
    }

    runEtapaSeleccionarPosicion() {
        const ctx = this.ctx;
        const jugador = this.jugadorLocal;

        this.mouseEstatus = 'select';

        let frames = () => {

            drawEtapaSeleccionarPosicion.local(ctx, jugador);


            if (this.posicionOnDrag !==null) {
                let p = this.posicionOnDrag;
                drawEtapaSeleccionarPosicion.drawDragSubmarino(ctx, p);
            }

            window.requestAnimationFrame(frames);

        };

        frames();

    }


    getPosicionRCCuadranteFromMouse(event): PosicionRCCuadrante {
        const x = event.clientX;
        const y = event.clientY;

        return factoryPosicionRCCuadrante.fromXY(x, y);

    }

    onMouseDownEtapaSeleccionarPosicion(event) {

        let posicionRCCuadrante = this.getPosicionRCCuadranteFromMouse(event);

        if (posicionRCCuadrante === null) {
            return;
        }

        if (posicionRCCuadrante.getIndexCuadrante() !== 0) {
            return;
        }

        let sub = this.getSubFromPos(posicionRCCuadrante);

        if (!sub) {
            return;
        }

        this.mouseEstatus = 'moviendose';
        this.submarinoOnDrag = sub;

        //actualizar esttado de subarino para ponerlo como drag

        let idSub=sub.id;
        this.jugadorLocal.getListaSubmarinos()
            .forEach(s => {
                s.isOnDrag = s.id=== idSub;
            });


        //guardar la posicion
        this.posicionOnDrag = posicionRCCuadrante;

    }

    onMouseUpEtapaSeleccionarPosicion(event) {

        let posicionRCCuadrante = this.getPosicionRCCuadranteFromMouse(event);

        if (posicionRCCuadrante === null) {
            return;
        }

        if (posicionRCCuadrante.getIndexCuadrante() !== 0) {
            return;
        }

       this.submarinoOnDrag.getPosicionRC().c=posicionRCCuadrante.getC();
       this.submarinoOnDrag.getPosicionRC().r=posicionRCCuadrante.getR();
       this.submarinoOnDrag.isOnDrag=false;

       this.posicionOnDrag=null;

        this.mouseEstatus = 'select';
    }


    onMouseMoveEtapaSeleccionarPosicion(event) {

        let posicionRCCuadrante = this.getPosicionRCCuadranteFromMouse(event);

        gameLoader.canvas.style.cursor = 'default';

        if (this.mouseEstatus === 'select') {

            //paso 1 encontrar si es una celda de region jugador

            if (posicionRCCuadrante === null) {
                return;
            }

            if (posicionRCCuadrante.getIndexCuadrante() !== 0) {
                return;
            }


            let sub = this.getSubFromPos(posicionRCCuadrante);


            if (!sub) {
                //no hay submarino
                return;
            }


            gameLoader.canvas.style.cursor = 'pointer';

        }

        if (this.mouseEstatus === 'moviendose') {




            if (posicionRCCuadrante === null) {
                this.mouseEstatus = 'select';
                this.submarinoOnDrag.isOnDrag=false;
                this.posicionOnDrag=null;
                return;
            }

            if (posicionRCCuadrante.getIndexCuadrante() !== 0) {
                this.mouseEstatus = 'select';
                this.submarinoOnDrag.isOnDrag=false;
                this.posicionOnDrag=null;
                return;

            }
            gameLoader.canvas.style.cursor = 'pointer';

            let sub = this.getSubFromPos(posicionRCCuadrante);


            if (sub) {
                //si hay un submarino no lo podemos poenr
                return;
            }


            gameLoader.canvas.style.cursor = 'move';

            this.posicionOnDrag = posicionRCCuadrante;


        }

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

