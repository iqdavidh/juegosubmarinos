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
            drawBatallaZonasAtacadas.exe(ctx);


            //Los cohete local
            const listaCohetesLocal = gameData.jugadorLocal.getListaCohetes()
                .filter(c => {
                    return c.getIsEstadoLanzado();
                });

            drawBatallaCohetesLocal.exe(ctx, contadorFrames, listaCohetesLocal);


            //Los cohetes dreotos
            const listaCohetesRemoto = gameData.listaCohetes
                .filter(c => {
                    return c.getIsEstadoLanzado();
                });

            drawBatallaCohetesLocal.exe(ctx, contadorFrames, listaCohetesRemoto);





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


        //validar que no sea una zona atacada anteriormetne --------------------------------
        const zonaAtacada= gameData.listaZonasAtacadas.find( z=>{

            const p=z.posicionRCC;

            return  p.getIndexCuadrante()=== posicionRCCuadrante.getIndexCuadrante() &&
                    p.getR() === posicionRCCuadrante.getR() &&
                    p.getC() === posicionRCCuadrante.getC() &&
                    z.isObjetivoAlcanzado === true
        });

        if(zonaAtacada){
            this.canvas.style.cursor = 'default';
            this.posicionEnLaMira = null;
            return;
        }




        // poscion valida para atacar - guardar que posicion estamos apuntando ------------
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

    onJugadorRemotoLanzaCohete( id_jugador: string, indexCuadrante : number, r:number, c:number){

        let jugadorRemoto= gameData.listaJugadores
            .find( j=>{
                return j.id=== id_jugador;
        });

        if(jugadorRemoto=== undefined || jugadorRemoto === null){
            console.log('no se eocntro el jugador ' + id_jugador);
        }

        //con el jugador encontrado atacar
        jugadorRemoto.lanzaCohete( indexCuadrante, r,c);




    }
}
