/* @flow */

class GameEngine {

    constructor(ctx, tokenRoom, jugadorLocal) {

        this.ctx = ctx;
        this.tokenRoom = tokenRoom;
        this.jugadorLocal = jugadorLocal;

        this.listaJugadores = [jugadorLocal];
    }

    addJugador(jugador) {
        this.listaJugadores.push(jugador);
    }

    runEtapaSeleccionarPosicion() {
        const ctx = this.ctx;
        drawEtapaSeleccionarPosicion.local(this.ctx, this.jugadorLocal);
    }

    onClickEtapaSeleccionarPosicion(event) {
        drawEtapaSeleccionarPosicion.onClickCanvas(event.clientX, event.clientY);
    }


    onMouseHoverEtapaSeleccionarPosicion(event) {
        const x = event.clientX;
        const y = event.clientY;


        //paso 1 encontrar si es una celda de region jugador
        let posicionRCCuadrante = factoryPosicionRCCuadrante.fromXY(x, y);


        if (posicionRCCuadrante === null) {
            return;
        }

        if (posicionRCCuadrante.getIndexCuadrante() !== 0) {
            return;
        }

        console.log(`${posicionRCCuadrante}`);

        //estamos en un cuadrante del centro , sigue ver si hay submarino

        let lista = this.jugadorLocal.getListaSubmarinos()
            .filter(s => {
                return s.getPosicionRC().r===posicionRCCuadrante.getR() &&
                    s.getPosicionRC().c=== posicionRCCuadrante.getC();
            });

        if(lista.length===0){
            //no es celda de submarino
            return;
        }

        let sub=lista[0];
        console.log('sub ----' + sub.getPosicionRC().toString());

        //drawEtapaSeleccionarPosicion.onMouseHoverCanvas();
    }

}

