/* @flow */

class GameEngine {

    constructor(ctx, tokenRoom, jugadorLocal) {

        this.ctx = ctx;
        this.tokenRoom = tokenRoom;
        this.jugadorLocal = jugadorLocal;
        this.listaJugadores = [jugadorLocal];

        this.mouseEstatus = null;

        this.submarinoOnDrag = null;
    }

    addJugador(jugador) {
        this.listaJugadores.push(jugador);
    }

    runEtapaSeleccionarPosicion() {
        const ctx = this.ctx;
        this.mouseEstatus = 'select';
        drawEtapaSeleccionarPosicion.local(this.ctx, this.jugadorLocal);
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

        this.mouseEstatus = 'start_move';
        this.submarinoOnDrag = sub;
        this.posicionOnDrag=null;

    }

    onMouseUpEtapaSeleccionarPosicion(event) {

        let posicionRCCuadrante = this.getPosicionRCCuadranteFromMouse(event);

        if (posicionRCCuadrante === null) {
            return;
        }

        if (posicionRCCuadrante.getIndexCuadrante() !== 0) {
            return;
        }

        this.mouseEstatus = 'select';
    }


    onMouseMoveEtapaSeleccionarPosicion(event) {

        let posicionRCCuadrante = this.getPosicionRCCuadranteFromMouse(event);


        if (this.mouseEstatus === 'select') {

            gameLoader.canvas.style.cursor = 'default';

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

        if (this.mouseEstatus === 'start_move') {
            gameLoader.canvas.style.cursor = 'move';

            let sub = this.getSubFromPos(posicionRCCuadrante);


            if (sub) {
                //si hay un submarino no lo podemos poenr
                return;
            }

            this.posicionOnDrag=posicionRCCuadrante;
            drawEtapaSeleccionarPosicion.drawDragSubmarino(gameLoader.ctx,posicionRCCuadrante)

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

