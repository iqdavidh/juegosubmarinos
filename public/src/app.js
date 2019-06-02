/*  */

const gameConfig = {
    size: 800,
    deltaSep: 30,
    numSubmarinos: 3,
    numDivisiones: 5,
    wDivision:2,
    resources: {
        imgMar: null
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

class GameEngine  {

    constructor(ctx, tokenRoom, jugadorLocal) {

        this.ctx = ctx;
        this.tokenRoom = tokenRoom;
        this.jugadorLocal=jugadorLocal;

        this.listaJugadores = [jugadorLocal];
    }

    addJugador(jugador) {
        this.listaJugadores.push(jugador);
    }

    runEtapaSeleccionarPosicion() {
        const ctx=this.ctx;
        drawEtapaSeleccionarPosicion.local(this.ctx, this.jugadorLocal);

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
/* @flow */

class Posicion {

    constructor(x, y, z=0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

}
class PosicionRC {

    constructor(r, c) {
        this.r = r;
        this.c = c;
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

    random : function(){

        let lista = [];


        while (lista.length < gameConfig.numSubmarinos) {
            //agregar submarino

            let r = Math.floor(Math.random() * 10);
            let c = Math.floor(Math.random() * 10);

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

let gameEngine=null;

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
    confirmarPosiciones:function(tokenRoom){

        let jugadorLocal=factoryJugador.local();

        gameEngine=new GameEngine( this.ctx, tokenRoom, jugadorLocal);

        gameEngine.runEtapaSeleccionarPosicion();

    }

};
/*@flow*/

const drawEtapaSeleccionarPosicion = {
    local: function (ctx, jugador) {
        const sizeRegion = gameConfig.size / 3;
        const delta = gameConfig.deltaSep;



        let cacheRegionConMar=this.getCacheCanvasRegionConMar( jugador);

        let origen = getOriginFromIndex(jugador.indexCuadrante);
        let origenMar = new Posicion(origen.x + delta, origen.y + delta);
        let sizeMar = sizeRegion - 2 * delta;

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


    },
    cacheCanvasRegionConMar:null,

    getCacheCanvasRegionConMar:function(jugador  ){

        if(this.cacheCanvasRegionConMar !==null){
            return this.cacheCanvasRegionConMar;
        }

        const sizeRegion = gameConfig.size / 3;
        const delta = gameConfig.deltaSep;


        const cacheRegionConMar = document.createElement('canvas');
        cacheRegionConMar.width = sizeRegion;
        cacheRegionConMar.height = sizeRegion;

        const ctxCache = cacheRegionConMar.getContext('2d');

        //el decorado de la region
        let origen = getOriginFromIndex(jugador.indexCuadrante);
        ctxCache.fillRect(0, 0, sizeRegion, sizeRegion);

        //la seccion de mar
        let sizeMar = sizeRegion - 2 * delta;
        ctxCache.drawImage(gameConfig.resources.imgMar, 0, 0, sizeMar, sizeMar, delta, delta, sizeMar, sizeMar);

        //las divisiones
        let sizeDiv = (sizeRegion - (gameConfig.wDivision * gameConfig.numDivisiones)) / gameConfig.numDivisiones;
        let rayaSize = sizeRegion - 2 * delta;

        let sizeCM = (sizeMar - gameConfig.numDivisiones * gameConfig.wDivision) / gameConfig.numDivisiones;


        ctxCache.fillStyle = "rgba(255, 255, 255, 0.7)";

        for (let i = 1; i < gameConfig.numDivisiones; i++) {
            ctxCache.fillRect(i * (sizeCM + gameConfig.wDivision) + delta, delta, gameConfig.wDivision, rayaSize);
            ctxCache.fillRect(delta, i * (sizeCM + gameConfig.wDivision) + delta, rayaSize, gameConfig.wDivision);
        }

        /* el cache de texto */
        ctxCache.font = '20px monospace';
        ctxCache.fillStyle = "rgba(200, 200, 200, 0.7)";
        ctxCache.fillText('SUBMARINOS', delta + 70, 24);

        this.cacheCanvasRegionConMar=cacheRegionConMar;

        return cacheRegionConMar;

    }
};


function getOriginFromIndex(index) {
    const size = gameConfig.size;
    const delta = gameConfig.deltaSep;

    if (index === 0) {
        return new Posicion(size * .33, size * .33, 0)
    } else {
        throw new Error("No tenemos eseIndex de jugador");
    }

}
/*FBUILD*/ console.log( 'FBUILD-20190602 17:11');  /*FBUILD*/

//# sourceMappingURL=app.js.map
