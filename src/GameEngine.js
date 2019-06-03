/* @flow */

class GameEngine {

    constructor(ctx, tokenRoom, jugadorLocal) {

        this.ctx = ctx;
        this.tokenRoom = tokenRoom;
        this.jugadorLocal = jugadorLocal;
        this.listaJugadores = [jugadorLocal];

        this.mouseEstatus = null;

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

        this.mouseEstatus = 'select';

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

            //console.log(`${posicionRCCuadrante}`);

            //estamos en un cuadrante del centro , sigue ver si hay submarino

            let sub = this.jugadorLocal.getListaSubmarinos()
                .find(s => {
                    return s.getPosicionRC().r === posicionRCCuadrante.getR() &&
                        s.getPosicionRC().c === posicionRCCuadrante.getC();
                });


            if (!sub ) {
                //no hay submarino
                return;
            }


            gameLoader.canvas.style.cursor = 'pointer';
            console.log('po');
        }


    }

}

