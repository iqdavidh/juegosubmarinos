/*  */

const gameConfig = {
    size: 800,
    deltaSep: 30,
    numSubmarinos: 3,
    numDivisiones: 5,
    wDivision: 2,
    resources: {
        imgMar: null
    }
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


function loadImage(url) {
    return new Promise(resolve => {
        const image = new Image();
        image.addEventListener('load', () => {
            resolve(image)
        });

        image.src = url;
    })
}



function loadBGMar(){
    return loadImage('/img/mar1.png')
}
//@flow

let EventoDummy = {

    addJugador2:function(){
        let j= factoryJugador.
        gameEngine.addJugador( j);
    }
};
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
function animador(){
    let ctx=gameLoader.ctx;

    ctx.fillRect(0,0,20,20)
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

        console.log(`${x},${y}`);

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
        console.log(sub.getPosicionRC().toString());

        //drawEtapaSeleccionarPosicion.onMouseHoverCanvas();
    }

}


class GameEngineDataIni {
    constructor() {
        this.size = null;
        this.listaJugador=[];
    }

    setSize(size){
        this.size=size;
    }

    addJugador(jugador){
        this.listaJugador.push(jugador);
    }

    getResOpeIsValid(){
        let isValid= true;
        let listaMsg=[];

        if(this.size===null){
            isValid=false;
            listaMsg.push('Size es null');
        }

        if(this.listaJugador.length<2){
            isValid=false;
            listaMsg.push('No hay jugadores suficientes');
        }

        if (isValid){
            return FactoryResultadoOpe.OK();
        }else{
            return FactoryResultadoOpe.Error('Error de validacion', listaMsg);
        }
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
class JugadorRemoto extends AJugador{

    constructor(indexCuadrante) {

        super(indexCuadrante);

        this.numSubmarinos= gameConfig.numSubmarinos;

    }

    getNumSubmarinos(){
        return this.numSubmarinos;
    }
}
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

            let r = 1 + Math.floor(Math.random() * gameConfig.numDivisiones);
            let c = 1 + Math.floor(Math.random() * gameConfig.numDivisiones);

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

let gameEngine = null;

let gameLoader = {

    canvas: null,
    ctx: null,
    start: function (tokenRoom) {

        if (this.isTerminado) {
            throw new Error("El loader ha termiando")
        }

        this.canvas = document.createElement('canvas');
        this.canvas.width = gameConfig.size;
        this.canvas.height = gameConfig.size;


        let container = document.getElementById('container');
        container.append(this.canvas);
        this.ctx = this.canvas.getContext('2d');

        Promise.all([
                loadBGMar()
            ]
        ).then(([imgMar]) => {
            //guardar los archivos cargados
            gameConfig.resources.imgMar = imgMar;
            this.confirmarPosiciones(tokenRoom);
        });

    },
    confirmarPosiciones: function (tokenRoom) {

        let jugadorLocal = factoryJugador.local();

        gameEngine = new GameEngine(this.ctx, tokenRoom, jugadorLocal);

        //eventos de mouse **************************************
        this.canvas.onclick = function (event) {
            gameEngine.onClickEtapaSeleccionarPosicion(event);
        };

        this.canvas.onmousemove=function(event){
            gameEngine.onMouseHoverEtapaSeleccionarPosicion(event);
        };


        gameEngine.runEtapaSeleccionarPosicion();

    }

};
/*@flow*/

const drawEtapaSeleccionarPosicion = {

    drawSubmarino: function (ctx, submarino) {

        const sizeRegion = gameCacheSize.getSizeRegion();
        const origen = submarino.jugador.getOrigenFromIndex();
        const delta = gameConfig.deltaSep;

        const origenMar = new Posicion(origen.x + delta, origen.y + delta);
        const sizeCM = gameCacheSize.getSizeCM();

        const x = origenMar.x + (submarino.getPosicionRC().r - 1) * (sizeCM + gameConfig.wDivision);
        const y = origenMar.y + (submarino.getPosicionRC().c - 1) * (sizeCM + gameConfig.wDivision);

        ctx.fillRect(x, y, sizeCM / 2, sizeCM / 2);


    },
    local: function (ctx, jugador) {
        const sizeRegion = gameConfig.size / 3;
        const delta = gameConfig.deltaSep;

        let cacheRegionConMar = this.getCacheCanvasRegionConMar(jugador);

        let origen = jugador.getOrigenFromIndex();


        /* draw el cache  */
        ctx.drawImage(cacheRegionConMar, 0, 0, sizeRegion, sizeRegion, origen.x, origen.y, sizeRegion, sizeRegion);

        //ctxCache.fillText('COHETES LISTOS', delta + 24, sizeMar + delta + 18);

        /* actualziar dra numero coehtes*/
        // let numCoheteListo = jugador.getNumCohetesReady();
        //
        // ctx.font = '20px monospace';
        // ctx.fillStyle = "rgba(0, 255, 0, 1)";
        // ctx.fillText(numCoheteListo.toString(), origenMar.x, origenMar.y + sizeMar + 18);


        /* actualziar dra numero sub*/
        let numSubmarino = jugador.getNumSubmarinos();
        ctx.fillStyle = "rgba(255, 255, 0, 1)";
        ctx.font = '20px monospace';
        ctx.fillText(numSubmarino.toString(), origen.x + sizeRegion - delta - 20, origen.y + delta - 6);


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
        ctxCache.font = '20px monospace';
        ctxCache.fillStyle = "rgba(200, 200, 200, 0.7)";
        ctxCache.fillText('SUBMARINOS', delta + 70, 24);

        this.cacheCanvasRegionConMar = cacheRegionConMar;

        return cacheRegionConMar;

    },
    onClickCanvas(x, y) {

        let posicionRCCuadrante=factoryPosicionRCCuadrante.fromXY(x,y);

        if(posicionRCCuadrante===null){
            console.log('null');
        }else{
            console.log(posicionRCCuadrante.toString());
        }
    },
    onMouseHoverCanvas(x,y){
        console.log(`${x},${y}`);
    }
};



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

    toString(){
        return `cuad:${this.indexCuadrante} c:${this.posicionRC.c} r: ${this.posicionRC.r}`;
    }
}

const factoryPosicionRCCuadrante = {
    fromXY: function (x, y) {

        //paso 1 determinar el cuadrante
        const sizeRegion =  gameCacheSize.getSizeRegion();
        const delta = gameConfig.deltaSep;

        function getPosicionCuadrante(valor) {
            return Math.floor(valor / sizeRegion);
        }

        let cuadranteX = getPosicionCuadrante(x);
        let cuadranteY = getPosicionCuadrante(y);

        if(cuadranteY===3 || cuadranteX===3){
            return null;
        }

        let code = `${cuadranteX}-${cuadranteY}`;

        let indexCuadrante = this.dicCuadranteIndex[code];

        let origenCuadrante = this.getOrigenCuadrante(indexCuadrante);

        //obtener rango del mar
        let xMarIni = origenCuadrante.x + delta;
        let xMarFin = xMarIni+ gameCacheSize.getSizeMar();

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

        const sizeRegion =  gameCacheSize.getSizeRegion();

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
/*FBUILD*/ console.log( 'FBUILD-20190602 20:44');  /*FBUILD*/

//# sourceMappingURL=app.js.map
