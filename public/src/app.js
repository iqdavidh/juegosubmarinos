/*  */

const gameConfig = {
    size: 700,
    deltaSep: 20,
    numSubmarinos: 8,
    numDivisiones: 6,
    wDivision: 2,
    resources: {
        imgMar: null
    }
};

const gameEstado = {
    ConfirmarPosicion: 'ConfirmarPosicion',
    EsperarParticipantes: 'EsperarParticipantes',
    Batalla: 'Batalla',
    TerminoBatalla: 'TerminoBatalla'
};

const gameCacheSize = {
    sizeRegion: null,
    getSizeRegion: function () {
        if (this.sizeRegion !== null) {
            return this.sizeRegion;
        }

        this.sizeRegion = gameConfig.size / 3;
        return this.sizeRegion;
    },

    sizeMar: null,
    getSizeMar: function () {
        if (this.sizeMar !== null) {
            return this.sizeMar;
        }
        const delta = gameConfig.deltaSep;
        this.sizeMar = this.getSizeRegion() - 2 * delta;
        return this.sizeMar;
    },
    sizeCM: null,
    getSizeCM: function () {

        if (this.sizeCM !== null) {
            return this.sizeCM;
        }

        const s = this.getSizeMar();
        const w = gameConfig.wDivision;

        this.sizeCM = (s - (gameConfig.numDivisiones - 1) * w) / gameConfig.numDivisiones;
        return this.sizeCM;
    }
};


function IDGenerator() {

    let length = 8;
    let timestamp = new Date;

    let _getRandomInt = function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    let ts = timestamp.toString();
    let parts = ts.split("").reverse();
    let id = "";

    for (let i = 0; i < length; ++i) {
        let index = _getRandomInt(0, parts.length - 1);
        id += parts[index];
    }

    return id;
}




function loadImage(url) {
    return new Promise(resolve => {
        const image = new Image();
        image.addEventListener('load', () => {
            resolve(image)
        });

        image.src = url;
    })
}



function loadImages(){
    return loadImage('/img/mar1.png')
}

function loadCanvasAndResources(callback){

    /* registrar canvas */
    if(!gameData.isCanvasLoaded){

        gameData.canvas = document.createElement('canvas');
        gameData.canvas.width = gameConfig.size;
        gameData.canvas.height = gameConfig.size;

        let container = document.getElementById('container');
        container.append(gameData.canvas);
        gameData.ctx = gameData.canvas.getContext('2d');

        gameData.isCanvasLoaded=true;
    }

    /* precargar archivos *************************** */

    Promise.all([
            loadImages()
        ]
    ).then(([imgMar]) => {
        callback(imgMar);
        gameConfig.isResourcesLoaded = true;
    });

}
//@flow

let EventoDummy = {

    token:'*token*',

    iniciar2Jugadores: function () {

        gameController.onRegistroSocket(this.token);

        let msg = {
            id_jugador: 2000,
            token: this.token
        };

        let jugador2 = factoryJugadorRemoto.fromMsgJugadorIngresa(msg);
        gameData.listaJugadores.push(jugador2);

    },
    confirmaJugador: function () {

        //el jugador que tenemos envia mensjae de confirmarciopn
        let j = gameData.listaJugadores
            .find(
                item => {
                    return !item.isPosicionConfirmada
                }
            )
        ;

        let msg=factoryMensajeSocket.JugadorConfirma( this.token, j.id);


        gameController.onRecibirMensajeSocket(msg);
    }
};
// @flow

class AEngine {

    constructor(fnOnContinuar){

        this.fnOnContinuar = fnOnContinuar;

        this.isRunning = null;
        this.canvas = gameData.canvas;
        this.ctx = gameData.ctx;
        this.tokenRoom = gameData.tokenRoom;
        this.jugadorLocal = gameData.jugadorLocal;

        this.mouseEstatus = null;
    }

    removeEventosMouseAndKeyBoard() {
        let canvas = gameData.canvas;

        canvas.onmousedown = (event) => {
            console.log('no listenging');
        };

        canvas.onmouseup = (event) => {
            console.log('no listenging');
        };

        canvas.onmousemove = (event) => {
            console.log('no listenging');
        };

        document.onkeydown = (event) => {
            console.log('no listenging');
        };
    }



}
/* @flow*/
class AJugador {

    constructor(indexCuadrante) {
        this.indexCuadrante = indexCuadrante;
        this.id = parseInt(Math.random() * 100000);
        this.isPosicionConfirmada = false;

        this.getIsLocal = () => {
            return indexCuadrante === 0;
        };

        this.listaAtaquesRecibidos = [];
        this.listaCohetes = [];

    }


    setPosicionConfirmada() {
        this.isPosicionConfirmada = true;
    }

    getListaCohetes() {
        return this.listaCohetes;
    }

    getOrigenFromIndex() {
        const size = gameConfig.size;
        const delta = gameConfig.deltaSep;


        if (this.indexCuadrante === 0) {
            return new Posicion(size * .33, size * .33, 0)
        } else {
            throw new Error("No tenemos eseIndex de jugador");
        }

    }
}
class Cohete {

    constructor(posicionIni) {
        this.posicionIni = posicionIni;
        this.estado = 'ready';
        this.velocidad = new Posicion(0, 0, 0);
        this.posicion = null;
    }

    getIsEstadoReady() {
        return this.estado ==='ready';
    }

    getIsEstadoLanzado() {
        return this.estado ==='lanzado';
    }

    lanzar(posicionFinalRC, posicionFinal) {
        this.estado='lanzado';
        this.posicionFinal = posicionFinal;
        this.posicionFinalRC = posicionFinalRC;
    }

    mover() {

    }

}
/* @flow */
class JugadorLocal extends AJugador {

    constructor(listaSubmarinos) {
        super(0);

        this.listaSubmarinos = listaSubmarinos;

        //asignar los submarinos al jugador actual
        this.listaSubmarinos
            .forEach(submarino => {
                submarino.setJugador(this);
            })
        ;


    }

    getListaSubmarinos(){
        return this.listaSubmarinos;
    }

    getNumSubmarinos() {
        return this.listaSubmarinos
            .filter(s => {
                return s.isActivo;
            }).length;
    }

    getNumCohetesReady() {
        let numCoheteListo = this.getListaCohetes()
            .filter(c => {
                return c.getIsEstadoReady();
            })
            .length;

        return numCoheteListo;
    }

}


const factoryJugador = {
    local: function () {
        let listaSubmarinos = factoryListaSubmarinos.random();
        return new JugadorLocal( listaSubmarinos);
    },
    remoto: function (index) {

        if (index === 0) {
            throw new Error("No se puede poner index 0 a jugador remoto");
        }
        return new JugadorRemoto(index);
    }
};
class JugadorRemoto extends AJugador {

    constructor(indexCuadrante) {

        super(indexCuadrante);

        this.numSubmarinos = gameConfig.numSubmarinos;

    }

    getNumSubmarinos() {
        return this.numSubmarinos;
    }


}


const factoryJugadorRemoto = {
    fromMsgJugadorIngresa: function (mensaje) {

        let numJugador=gameData.listaJugadores.length +1 ;

        return new JugadorRemoto(numJugador)
    }
};
class ResultadoOpe {

    constructor(isOk, msg, dataAdicional) {

        this.getIsSuccess = function () {
            return isOk;
        };

        this.getMsg = function () {
            return msg;
        };

        this.getData = function () {
            return dataAdicional;
        }

    }

}

let FactoryResultadoOpe = {
    OK: function (data = null) {
        return new ResultadoOpe(true, msg, data);
    },
    Error: function (msg, data = null) {
        return new ResultadoOpe(false, msg, data);
    }

};
//@flow

class Submarino {

    constructor(posicionRC) {

        this.id=IDGenerator();
        this.isOnDrag=false;
        this.posicionRC = posicionRC;
        this.isActivo = true;
        this.isCoheteListo = false;
        this.jugador = null;
        this.isSetJugador = false;
    }

    setJugador(jugador) {
        this.jugador = jugador;
        this.isSetJugador = true;
    }

    getPosicionRC() {
        return this.posicionRC;
    }

    recibeImpacto() {
        this.isActivo = false;
        this.isCoheteListo = false;
    }


    lanzaCohete(fnCB) {

    }


}


const factoryListaSubmarinos = {

    random: function () {

        let lista = [];


        while (lista.length < gameConfig.numSubmarinos) {
            //agregar submarino


            let r = 1 + Math.floor(Math.random() * (gameConfig.numDivisiones));
            let c = 1 + Math.floor(Math.random() * (gameConfig.numDivisiones));

            //buscar si se repiten

            let numCoincidencias = lista
                .filter(item => {
                    return item.posicionRC.r === r && item.posicionRC.c === c;
                })
                .length
            ;

            if (numCoincidencias === 0) {

                let posicionRC = new PosicionRC(r, c);
                let submarino = new Submarino(posicionRC);
                lista.push(submarino);
            }

        }


        return lista;
    }
};

'use strict';

const gameData = {
    tokenRoom: null,
    canvas: null,
    ctx: null,
    jugadorLocal: null,
    listaJugadores: [],
    listaCohetes: [],
    listaMsgSocket: [],
    estado: null,
    isResourcesLoaded: false,
    isCanvasLoaded: false
};


loadCanvasAndResources((imgMar) => {
    gameConfig.resources.imgMar = imgMar;
});


const gameController = {

    engine: {
        selpos: null,
        esperarParticipantes: null
    },
    onRegistroSocket: function (token) {
        gameData.tokenRoom = token;
        gameData.jugadorLocal = factoryJugador.local();

        this.start()
    },
    start: function () {

        if (gameData.isResourcesLoaded) {
            this.runConfirmarPosiciones();

        } else {

            loadCanvasAndResources((imgMar) => {
                gameConfig.resources.imgMar = imgMar;
                this.runConfirmarPosiciones();
            });

        }
    },
    runConfirmarPosiciones: function () {

        gameData.estado = gameEstado.ConfirmarPosicion;

        let fnOnConfirmar = () => {
            gameController.runEsperarParticipantes();

            this.engine.selpos = null;
        };

        this.engine.selpos = new EngineSelPos(fnOnConfirmar);
        this.engine.selpos.run();

    },
    runEsperarParticipantes: function () {


        gameData.estado = gameEstado.EsperarParticipantes;

        let fnOnContinuar = () => {
            function frame(){
                gameData.ctx.fillStyle = `rgb(0, 0, 0)`;
                gameData.ctx.fillRect(0, 0, gameConfig.size, gameConfig.size);
            }
            window.requestAnimationFrame(frame);


            gameController.runBatalla();

            this.engine.esperarParticipantes = null;
        };

        this.engine.esperarParticipantes = new EngineEsperar(fnOnContinuar);
        this.engine.esperarParticipantes.run();
    },
    runBatalla: function () {
        gameData.estado = gameEstado.Batalla;
        console.log('ya esta inicaida la batalla');
    },
    onRecibirMensajeSocket: function (msg) {
        proRecibirMsgSocket.exe(msg);
    },
    onEnviarMensajeSocket: function (msg) {

        //TODO enviar mensaje de confirmar
    }


};
/*@flow*/

const drawSelPos = {

    drawSubmarino: function (ctx, submarino) {

        const origen = submarino.jugador.getOrigenFromIndex();
        const delta = gameConfig.deltaSep;

        const origenMar = new Posicion(origen.x + delta, origen.y + delta);
        const sizeCM = gameCacheSize.getSizeCM();

        const x = origenMar.x + (submarino.getPosicionRC().c - 1) * (sizeCM + gameConfig.wDivision);
        const y = origenMar.y + (submarino.getPosicionRC().r - 1) * (sizeCM + gameConfig.wDivision);

        //se dibuja diferente si esta en drag
        if( submarino.isOnDrag){
            ctx.fillStyle = "rgba(100, 100, 100, 0.5)";
        }else{
            ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
        }

        let submarinoSize=sizeCM / 2;
        let dy=sizeCM/4;

        ctx.fillRect(x +dy, y +sizeCM/4,submarinoSize , submarinoSize);
    },
    drawDragSubmarino:function(ctx,posicionRCC){

        const origen =factoryPosicionRCCuadrante.getOrigenCuadrante( posicionRCC.getIndexCuadrante());

        const delta = gameConfig.deltaSep;

        const origenMar = new Posicion(origen.x + delta, origen.y + delta);
        const sizeCM = gameCacheSize.getSizeCM();

        const x = origenMar.x + (posicionRCC.getC() - 1) * (sizeCM + gameConfig.wDivision);
        const y = origenMar.y + (posicionRCC.getR() - 1) * (sizeCM + gameConfig.wDivision);

        ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
        let submarinoSize=sizeCM / 2;
        ctx.fillRect(x +sizeCM/4, y +sizeCM/4,submarinoSize , submarinoSize);


    },

    local: function (ctx, jugador) {

        const delta = gameConfig.deltaSep;
        const sizeRegion = gameCacheSize.getSizeRegion();

        let cacheRegionConMar = this.getCacheCanvasRegionConMar(jugador);

        let origen = jugador.getOrigenFromIndex();


        /* draw el cache  */
        ctx.drawImage(cacheRegionConMar, 0, 0, sizeRegion, sizeRegion, origen.x, origen.y, sizeRegion, sizeRegion);


        /* actualziar dra numero sub*/
        let numSubmarino = jugador.getNumSubmarinos();
        ctx.fillStyle = "rgba(255, 255, 0, 1)";
        ctx.font = '19px monospace';
        ctx.fillText(numSubmarino.toString(), origen.x + sizeRegion - delta - 20, origen.y + delta - 4);



        let sizeTexto=470;
        let dx= ( (sizeRegion *3) - sizeTexto )/2;
        ctx.fillStyle = "rgba(255, 255, 255, 1)";
        ctx.fillText('Arrastra los submarinos a la posición deseada', dx, sizeRegion*2+50);
        ctx.fillText('Presiona Enter para continuar', dx +80, sizeRegion*2+100);


        jugador.getListaSubmarinos().forEach(s => {
            this.drawSubmarino(ctx, s);
        });

    },
    cacheCanvasRegionConMar: null,
    getCacheCanvasRegionConMar: function (jugador) {

        if (this.cacheCanvasRegionConMar !== null) {
            return this.cacheCanvasRegionConMar;
        }

        const sizeRegion = gameConfig.size / 3;
        const delta = gameConfig.deltaSep;


        const cacheRegionConMar = document.createElement('canvas');
        cacheRegionConMar.width = sizeRegion;
        cacheRegionConMar.height = sizeRegion;

        const ctxCache = cacheRegionConMar.getContext('2d');

        //el decorado de la region
        const origen = jugador.getOrigenFromIndex();
        ctxCache.fillRect(0, 0, sizeRegion, sizeRegion);

        //la seccion de mar
        const sizeMar = sizeRegion - 2 * delta;
        ctxCache.drawImage(gameConfig.resources.imgMar, 0, 0, sizeMar, sizeMar, delta, delta, sizeMar, sizeMar);

        //las divisiones
        const sizeDiv = (sizeRegion - (gameConfig.wDivision * gameConfig.numDivisiones)) / gameConfig.numDivisiones;
        const rayaSize = sizeRegion - 2 * delta;

        const sizeCM = (sizeMar - gameConfig.numDivisiones * gameConfig.wDivision) / gameConfig.numDivisiones;


        ctxCache.fillStyle = "rgba(255, 255, 255, 0.7)";

        for (let i = 1; i < gameConfig.numDivisiones; i++) {
            ctxCache.fillRect(i * (sizeCM + gameConfig.wDivision) + delta, delta, gameConfig.wDivision, rayaSize);
            ctxCache.fillRect(delta, i * (sizeCM + gameConfig.wDivision) + delta, rayaSize, gameConfig.wDivision);
        }

        /* el cache de texto */
        ctxCache.font = '19px monospace';
        ctxCache.fillStyle = "rgba(200, 200, 200, 0.7)";
        ctxCache.fillText('SUBMARINOS', sizeMar - 112, 16);

        this.cacheCanvasRegionConMar = cacheRegionConMar;

        return cacheRegionConMar;

    },
    onClickCanvas(x, y) {


    },
    onMouseHoverCanvas(x,y){
        console.log(`${x},${y}`);
    }
};



/* @flow */

class EngineSelPos extends AEngine {

    constructor(fnOnContinuar) {

        super(fnOnContinuar);

        this.posicionOnDrag = null;
        this.submarinoOnDrag = null;
        this.mouseEstatus = null;

        this.addEventosMouseAndKeyboard(
            this.onMouseDown,
            this.onMouseUp,
            this.onMouseMove,
            this.onKeyDow
        );

    }

    run() {
        const ctx = this.ctx;
        const jugador = this.jugadorLocal;

        this.mouseEstatus = 'select';
        this.isRunning = true;

        let idFrame = null;

        const frames = () => {

            if (!this.isRunning) {
                window.cancelAnimationFrame(idFrame);
                return;
            }

            drawSelPos.local(ctx, jugador);


            if (this.posicionOnDrag !== null) {
                let p = this.posicionOnDrag;
                drawSelPos.drawDragSubmarino(ctx, p);
            }


            idFrame = window.requestAnimationFrame(frames);

        };

        idFrame = window.requestAnimationFrame(frames);


    }

    addEventosMouseAndKeyboard() {

        let canvas = gameData.canvas;

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

        //ver si en la posicion hay un submariuono - no se puede encimar
        let sub = this.getSubFromPos(posicionRCCuadrante);


        if (sub) {
            //hay submarino
            this.submarinoOnDrag.isOnDrag = false;
            this.submarinoOnDrag = null;
            this.posicionOnDrag = null;
            this.mouseEstatus = 'select';
            this.canvas.style.cursor = 'pointer';
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

            this.canvas.style.cursor = 'pointer';
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

        this.isRunning = false;
        this.removeEventosMouseAndKeyBoard();
        this.fnOnContinuar();

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

        let fnCallback = () => {
            //actulizar texto de jugadores confirmados
            this.onJugadorRemotoConfirma();
        };

        drawEsperar.oscurecer(ctx, fnCallback);
    }

    onJugadorRemotoConfirma() {
        const ctx = this.ctx;
        let numJugadores = gameData.listaJugadores.length;


        let numConfirmados = gameData.listaJugadores
            .filter(j => {
                return j.isPosicionConfirmada;
            }).length;


        //poner el texto caundots jugadores estan confirmados
        drawEsperar.actualizarTextoEspera(ctx, numJugadores, numConfirmados);


        if (numJugadores === numConfirmados) {


            setTimeout( this.fnOnContinuar, 2000);
        }

    }

}
/* @flow */

class Posicion {

    constructor(x, y, z=0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    toString(){
        return `${this.x}, ${this.y}`;
    }

}
class PosicionRC {

    constructor(r, c) {
        this.r = r;
        this.c = c;
    }

    toString(){
        return `c:${this.c},r:${this.r}`;
    }
}
class PosicionRCCuadrante {

    constructor(indexCuadrante, posicionRC) {
        this.indexCuadrante = indexCuadrante;
        this.posicionRC = posicionRC;
    }

    getIndexCuadrante() {
        return this.indexCuadrante;
    }

    getR() {
        return this.posicionRC.r;
    }

    getC() {
        return this.posicionRC.c;
    }

    toString() {
        return `cuad:${this.indexCuadrante} c:${this.posicionRC.c} r: ${this.posicionRC.r}`;
    }
}

const factoryPosicionRCCuadrante = {

    fromEventMouse: function (event) {
        const x = event.clientX;
        const y = event.clientY;

        return this.fromXY(x, y);
    },
    fromXY: function (x, y) {

        //paso 1 determinar el cuadrante
        const sizeRegion = gameCacheSize.getSizeRegion();
        const delta = gameConfig.deltaSep;

        function getPosicionCuadrante(valor) {
            return Math.floor(valor / sizeRegion);
        }

        let cuadranteX = getPosicionCuadrante(x);
        let cuadranteY = getPosicionCuadrante(y);

        if (cuadranteY === 3 || cuadranteX === 3) {
            return null;
        }

        let code = `${cuadranteX}-${cuadranteY}`;

        let indexCuadrante = this.dicCuadranteIndex[code];

        let origenCuadrante = this.getOrigenCuadrante(indexCuadrante);

        //obtener rango del mar
        let xMarIni = origenCuadrante.x + delta;
        let xMarFin = xMarIni + gameCacheSize.getSizeMar();

        let yMarIni = origenCuadrante.y + delta;
        let yMarFin = yMarIni + gameCacheSize.getSizeMar();


        if (x >= xMarIni && x <= xMarFin && y >= yMarIni && y <= yMarFin) {

            //encontrar la posicion RC
            let xRel = x - xMarIni;
            let yRel = y - yMarIni;
            let celda = gameCacheSize.getSizeCM() + gameConfig.wDivision;

            let c = 1 + Math.floor(xRel / celda);
            let r = 1 + Math.floor(yRel / celda);
            let posicionRC = new PosicionRC(r, c);
            return new PosicionRCCuadrante(indexCuadrante, posicionRC);

        } else {
            return null;
        }
    },

    dicCuadranteIndex: {
        '0-0': 5,
        '0-1': 2,
        '0-2': 7,
        '1-0': 1,
        '1-1': 0,
        '1-2': 4,
        '2-0': 6,
        '2-1': 3,
        '2-2': 8,
    },
    getOrigenCuadrante(cuadrante) {

        const sizeRegion = gameCacheSize.getSizeRegion();

        if (cuadrante === 5) {
            return new Posicion(0, 0);
        } else if (cuadrante === 1) {
            return new Posicion(sizeRegion, 0);
        } else if (cuadrante === 6) {
            return new Posicion(sizeRegion * 2, 0);
        }

        if (cuadrante === 2) {
            return new Posicion(0, sizeRegion);
        } else if (cuadrante === 0) {
            return new Posicion(sizeRegion, sizeRegion);
        } else if (cuadrante === 3) {
            return new Posicion(sizeRegion * 2, sizeRegion);
        }


        if (cuadrante === 7) {
            return new Posicion(0, sizeRegion * 2);
        } else if (cuadrante === 4) {
            return new Posicion(sizeRegion, sizeRegion * 2);
        } else if (cuadrante === 8) {
            return new Posicion(sizeRegion * 2, sizeRegion * 2);
        }

        throw new Error("Ese cuadrante no esta soportado " + cuadrante.toString());
    }

};
//@flow

const configTipoMensaje = {
    JugadorIngresa:'JugadorIngresa',
    JugadorSale:'JugadorSale',
    IniciarBatalla: 'IniciarBatalla',
    LanzarCohete:'LanzarCohete',
    ResultadoAtaque:'ResultadoAtaque',
    Rendicion:'Rendicion',
    TerminoBatalla:'TerminoBatalla'
};















/* @flow */
const tipoMsgSocket = {
    ingresa: 'ingresa',
    sale:'sale',
    confirma_posiciones:'confirma_posiciones',
    inicia_batalla:'inicia_batalla',
    lanza_cohete:'lanza_cohete',
    resultado_ataque:'resultado_ataque',
};


const factoryMensajeSocket = {
    JugadorIngresa: function (token, id_jugador) {
        return {
            id_jugador,
            token,
            tipo: tipoMsgSocket.ingresa
        };
    },
    JugadorConfirma: function (token, id_jugador) {
        return {
            id_jugador,
            token,
            tipo: tipoMsgSocket.confirma_posiciones
        }
    }
};
/* @flow */

const proRecibirMsgSocket = {
    exe: function (data) {

        const jugador=this.getJugadorFromId( parseInt( data.id_jugador ));

        if (data.tipo === tipoMsgSocket.ingresa) {
            this.jugador_ingresa(jugador);


        } else if (data.tipo === tipoMsgSocket.confirma_posiciones) {
            this.jugador_confirma_posicion(jugador)

        } else {
            alert("no esperamos este tipo de mensaje " + data.tipo)
        }


    },
    jugador_ingresa: function ( jugador) {

    },
    jugador_confirma_posicion: function ( jugador) {
        jugador.setPosicionConfirmada();

        //notificar al controller
        gameController.engine.esperarParticipantes.onJugadorRemotoConfirma();
    },
    getJugadorFromId: function (id_jugador) {


        return gameData.listaJugadores
            .find(
                jugador => {
                    return jugador.id === id_jugador;
                }
            )
        ;


    }

};
/*FBUILD*/ console.log( 'FBUILD-20190606 11:12');  /*FBUILD*/

//# sourceMappingURL=app.js.map
