/* @flow */

class EngineSelPos {

    constructor(canvas, tokenRoom, jugadorLocal) {

        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.tokenRoom = tokenRoom;
        this.jugadorLocal = jugadorLocal;
        this.listaJugadores = [jugadorLocal];

        this.mouseEstatus = null;

        this.posicionOnDrag = null;
        this.submarinoOnDrag = null;

        this.addEventosMouseAndKeyboard(canvas);
    }

    addJugador(jugador) {
        this.listaJugadores.push(jugador);
    }

    run() {
        const ctx = this.ctx;
        const jugador = this.jugadorLocal;

        this.mouseEstatus = 'select';

        let frames = () => {

            drawSelPos.local(ctx, jugador);


            if (this.posicionOnDrag !== null) {
                let p = this.posicionOnDrag;
                drawSelPos.drawDragSubmarino(ctx, p);
            }

            window.requestAnimationFrame(frames);

        };

        frames();

    }


    addEventosMouseAndKeyboard(canvas) {

        canvas.onmousedown = (event) => {
            this.onMouseDown(event);
        };

        canvas.onmouseup = (event) => {
            this.onMouseUp(event);
        };

        canvas.onmousemove = (event) => {
            this.onMouseMove(event);
        };

        document.onkeydown = (event) => {
            this.onKeyDow(event);
        };
    }

    onMouseDown(event) {



        let posicionRCCuadrante = factoryPosicionRCCuadrante.fromEventMouse(event);

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

        this.submarinoOnDrag = sub;

        this.mouseEstatus = 'arrastrando';
       // this.canvas.style.cursor = 'move';

        //actualizar esttado de subarino para ponerlo como drag

        let idSub = sub.id;
        this.jugadorLocal.getListaSubmarinos()
            .forEach(s => {
                s.isOnDrag = s.id === idSub;
            });


        //guardar la posicion
        this.posicionOnDrag = posicionRCCuadrante;

    }

    onMouseUp(event) {

        if (this.mouseEstatus !== 'arrastrando') {
            return;
        }


        let posicionRCCuadrante = factoryPosicionRCCuadrante.fromEventMouse(event);


        if (posicionRCCuadrante === null) {
            this.mouseEstatus = 'select';
            return;
        }

        if (posicionRCCuadrante.getIndexCuadrante() !== 0) {
            this.mouseEstatus = 'select';
            return;
        }

        this.submarinoOnDrag.getPosicionRC().c = posicionRCCuadrante.getC();
        this.submarinoOnDrag.getPosicionRC().r = posicionRCCuadrante.getR();
        this.submarinoOnDrag.isOnDrag = false;

        this.submarinoOnDrag = null;
        this.posicionOnDrag = null;

        this.mouseEstatus = 'select';
        this.canvas.style.cursor = 'pointer';
    }

    onMouseMove(event) {

        let posicionRCCuadrante = factoryPosicionRCCuadrante.fromEventMouse(event);



        if (this.mouseEstatus === 'select') {

            this.canvas.style.cursor = 'default';

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


            this.canvas.style.cursor = 'pointer';

        }

        if (this.mouseEstatus === 'arrastrando') {

           // this.canvas.style.cursor = 'move';

            if (posicionRCCuadrante === null) {
                this.mouseEstatus = 'select';
                this.submarinoOnDrag.isOnDrag = false;
                this.posicionOnDrag = null;
                return;
            }

            if (posicionRCCuadrante.getIndexCuadrante() !== 0) {
                this.mouseEstatus = 'select';
                this.submarinoOnDrag.isOnDrag = false;
                this.posicionOnDrag = null;
                return;

            }

            let sub = this.getSubFromPos(posicionRCCuadrante);


            if (sub) {
                //si hay un submarino no lo podemos poenr
                return;
            }

            this.posicionOnDrag = posicionRCCuadrante;

        }

    }

    onKeyDow(event) {

        if (event.code !== "Enter") {
            return;
        }

        //confirmar que ya se termino
        console.log('confimrado');
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

