/*  */

const gameConfig = {
    size: 900,
    deltaSep: 20,
    numSubmarinos: 4,
    numDivisiones: 4,
    wDivision: 2,
    sPrepararCohete:0, /*<------------*/
    velocidadCohete:10,
    sizeCohete:50,
    isAudio:false,
    resources: {
        imgMar: null,
        imgBullet:null ,
        imgTanque:null,
        imgTanqueDest:null,
        imgRocket:null,
        imgExplosion:null
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

let consecutivo=0;

function IDGenerator(token){

    consecutivo++;
    return token + consecutivo.toString();

    //
    // let _getRandomInt = function (min, max) {
    //     return Math.floor(Math.random() * (max - min + 1)) + min;
    // };
    //
    // return _getRandomInt(0, 100000) ;

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


    function loadMar(){
        return loadImage('/img/mar1.png')
    }

    function loadBullet(){
        return loadImage( '/img/Bullet.png');
    }

    function loadTanque(){
        return loadImage( '/img/tanque.png');
    }

    function loadTanqueDestruido(){
        return loadImage( '/img/tanque_destruido.png');
    }

    function loadRocket(){
        return loadImage( '/img/Rocket150.png');
    }

    function loadExplosion(){
        return loadImage( '/img/explosion50.png');
    }

    Promise.all([
            loadMar(),loadBullet(), loadTanque(),
            loadTanqueDestruido(), loadRocket(),loadExplosion()
        ]
    ).then(([imgMar, imgBullet, imgTanque,
                           imgTanqueDest, imgRocket, imgExplosion]) => {
        callback(imgMar, imgBullet, imgTanque
            , imgTanqueDest, imgRocket, imgExplosion);
        gameConfig.isResourcesLoaded = true;
    });

}
//@flow
/* use strict */

const gameReloj = {


    idInterval: null,
    tiempo: 0,
    getTiempo() {
        return this.tiempo;
    },
    start: function () {
        gameReloj.tiempo = 0;
        this.idInterval = window.setInterval(gameReloj.loop, 500);
    },
    stop: function () {

    },
    loop: () => {

        gameReloj.tiempo += 0.5;

        const tiempo = gameReloj.tiempo;

        // console.log(tiempo);

        //recargar de cohetes los submarinos
        let listaSubActivos = gameData.jugadorLocal.getListaSubmarinos()
            .filter(s => {
                return s.getIsActivo() && s.tiempoCoheteReady <= tiempo && s.tiempoCoheteReady > 0;
            })
        ;

        //con estos submarinos construiir cohetes
        listaSubActivos.forEach(s => {
            //console.log('l1' + s.ToString());
            const cohete = factoryCohete.jugadorLocal(s);

            gameData.jugadorLocal.listaCohetes.push(cohete);

            s.ResetTiempoCoheteReady();
            //console.log('l2' + s.ToString());
        });


    }

};
//@flow

let EventoDummy = {

    token: '*token*',

    iniciar2Jugadores: function () {


        let msg = {
            id_jugador: "2000",
            token: this.token
        };

        let jugador2 = factoryJugadorRemoto.fromMsgJugadorIngresa(msg);
        gameData.listaJugadores.push(jugador2);

        gameController.onRegistroSocket(this.token);

    },
    confirmaJugadorRemoto: function () {

        //el jugador que tenemos envia mensjae de confirmarciopn
        let j = gameData.listaJugadores
            .find(
                item => {
                    return !item.isPosicionConfirmada
                }
            )
        ;

        let msg = factoryMensajeSocket.JugadorConfirma(j.id);


        gameController.onRecibirMensajeSocket(msg);
    }
    ,
    iniciar2JugadoresyConfirmar: function () {


        this.iniciar2Jugadores();
        this.confirmaJugadorRemoto();
        // //confirma jugador local
        let fn = () => {
            gameController.engine.selpos.onKeyDow({code: "Enter"});
        };
        setTimeout(fn, 1000);

    },

    t8: function () {
        gameController.onRegistroSocket(this.token);

        //regsitrar
        for (let i = 1; i <= 8; i++) {
            let msg = {
                id_jugador: (i * 1000).toString(),
                token: gameData.tokenRoom
            };
            let j = factoryJugadorRemoto.fromMsgJugadorIngresa(msg);
            gameData.listaJugadores.push(j);
        }


        //confirmar
        gameData.listaJugadores
            .forEach(j => {

                let msg = factoryMensajeSocket.JugadorConfirma(j.id);
                gameController.onRecibirMensajeSocket(msg)

            });

        // //confirma jugador local
        let fn = () => {
            gameController.engine.selpos.onKeyDow({code: "Enter"});
        };
        setTimeout(fn, 1000);

    },
    j1Ataca: function () {
        return this._jAtaca(1);
    },
    j2Ataca: function () {
        return this._jAtaca(2);
    },
    j3Ataca: function () {
        return this._jAtaca(3);
    },
    j4Ataca: function () {
        return this._jAtaca(4);
    },
    j5Ataca: function () {
        return this._jAtaca(5);
    },
    j6Ataca: function () {
        return this._jAtaca(6);
    },
    j7Ataca: function () {
        return this._jAtaca(7);
    },
    j8Ataca: function () {
        return this._jAtaca(8);
    },


    _jAtaca: function (indexCuadranteAtacante) {

        let idAtacante = null;

        if (indexCuadranteAtacante === 0) {
            idAtacante = gameData.jugadorLocal.id;
        } else {
            idAtacante = gameData.listaJugadores
                .find(j => {
                    return j.indexCuadrante === indexCuadranteAtacante;
                })
                .id
            ;
        }


        for (indexCuadrante = 0; indexCuadrante < 9; indexCuadrante++) {

            if (indexCuadrante !== indexCuadranteAtacante) {

                let j = null;

                if (indexCuadrante === 0) {
                    j = gameData.jugadorLocal;
                } else {

                    j = gameData.listaJugadores
                        .find(item => {
                            return item.indexCuadrante === indexCuadrante;
                        });
                }


                let msg = factoryMensajeSocket.LanzaCohete(idAtacante, j.id, 1, 1);
                gameController.onRecibirMensajeSocket(msg);


            }


        }

    },
    simularJ1RecibeAtaque: function (r, c, isSubmarino) {


        let id = gameData.listaJugadores[0].id;

        const jugador1 = gameData.listaJugadores
            .find(j => {
                return j.id === id;
            });


        let msg = factoryMensajeSocket.ResultadoAtaque(id, r, c, isSubmarino, false);
        gameController.onRecibirMensajeSocket(msg);
    },
    j1Recibe:function(){
        return this._rRecibe(1);
    },
    j2Recibe:function(){
        return this._rRecibe(2);
    },
    j3Recibe:function(){
        return this._rRecibe(3);
    },
    j4Recibe:function(){
        return this._rRecibe(4);
    },
    j5Recibe:function(){
        return this._rRecibe(5);
    },
    _rRecibe:function(indexCuadrante){

        let id = gameData.listaJugadores.find( j=>{
            return j.indexCuadrante === indexCuadrante
        }).id;


        let msg = factoryMensajeSocket.ResultadoAtaque(id, 1, 1, false, false);
        gameController.onRecibirMensajeSocket(msg);

        msg = factoryMensajeSocket.ResultadoAtaque(id, 2, 2, true, false);
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
            // console.log('no listenging');
        };

        canvas.onmouseup = (event) => {
            // console.log('no listenging');
        };

        canvas.onmousemove = (event) => {
            // console.log('no listenging');
        };

        document.onkeydown = (event) => {
            // console.log('no listenging');
        };
    }



}
/* @flow*/
class AJugador {

    constructor(indexCuadrante, id_jugador) {

        if (id_jugador) {
            this.id = id_jugador;
        } else {
            this.id = 'player-' + (Math.random().toString(36).substring(2, 16) + Math.random().toString(36).substring(2, 16)).toUpperCase();
        }

        this.indexCuadrante = indexCuadrante;
        this.isPosicionConfirmada = false;

        this.getIsLocal = () => {
            return indexCuadrante === 0;
        };

        this.listaAtaquesRecibidos = [];
        this.listaCohetes = [];

    }


    getIndexCuadrante() {
        return this.indexCuadrante;
    }

    setPosicionConfirmada() {
        this.isPosicionConfirmada = true;
    }

    getListaCohetes() {
        return this.listaCohetes;
    }

    getOrigenFromIndex() {
        return factoryPosicionRCCuadrante.getOrigenCuadrante(this.indexCuadrante);
    }
}
//@flow
"use strict";

const factoryZonaAtacada = {
    exe: function (posicionRCC, idCohete, id_jugador, isObjetivoAlcanzado = false
)
{

    let isSubmarino = null;
    const id = IDGenerator('zona');
    const indexCuadrante = posicionRCC.getIndexCuadrante();


    return {
        id,
        idCohete,
        isObjetivoAlcanzado,
        indexCuadrante,
        id_jugador,
        posicionRCC,
        isSubmarino
    };
}
}
;
/* @flow */
class JugadorLocal extends AJugador {

    constructor(listaSubmarinos) {
        super(0);
        this.listaSubmarinos = listaSubmarinos;
    }

    getListaSubmarinos() {
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

    lanzaCohete(posicionEnLaMira) {

        //buscar un cohete que este en estado ready
        const cohete = this.getListaCohetes()
            .find(s => {
                return s.getIsEstadoReady();
            });

        if (cohete) {
            let posicionAbs = posicionEnLaMira.getPosAbs();

            cohete.lanzar(posicionAbs);

            //agreagamos la zona atacada
            
            let zonaAtacada=factoryZonaAtacada.exe(posicionEnLaMira, cohete.id , gameData.jugadorLocal.id);
            gameData.listaZonasAtacadas.push(zonaAtacada);

        }

    }
}


const factoryJugador = {
    local: function () {
        let listaSubmarinos = factoryListaSubmarinos.random();
        return new JugadorLocal(listaSubmarinos);
    },
    remoto: function (index) {

        if (index === 0) {
            throw new Error("No se puede poner index 0 a jugador remoto");
        }
        return new JugadorRemoto(index);
    }
};
class JugadorRemoto extends AJugador {

    constructor(indexCuadrante, id_jugador) {

        super(indexCuadrante, id_jugador);

        this.numSubmarinos = gameConfig.numSubmarinos;

    }

    onSubmarinoDestruido() {
        this.numSubmarinos--;
    }

    getNumSubmarinos() {
        return this.numSubmarinos;
    }

    lanzaCohete(indexCuadrante, r, c) {

        //el cohete remoto solo necesito del jugador, alli sle su punto de inicio siempre
        const cohete = new CoheteRemoto(this);

        gameData.listaCohetes.push(cohete);


        let posicionRC = new PosicionRC(r, c);
        let posicionEnLaMira = new PosicionRCCuadrante(indexCuadrante, posicionRC);
        let posicionAbs = posicionEnLaMira.getPosAbs();
        cohete.lanzar(posicionAbs);

        let zonaAtacada = factoryZonaAtacada.exe(posicionEnLaMira, cohete.id, this.id);

        gameData.listaZonasAtacadas.push(zonaAtacada);
    }

}


const factoryJugadorRemoto = {
    fromMsgJugadorIngresa: function (msg) {

        let numJugador = gameData.listaJugadores.length + 1;

        return new JugadorRemoto(numJugador, msg.id_jugador)
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
"use strict";

class Submarino {

    constructor(posicionRC) {

        this.id = IDGenerator('s');
        this.isOnDrag = false;
        this.posicionRC = posicionRC;
        this.isActivo = true;

        /* al copsntruise se les da 1 segundo para preparar los cohetes*/
        this.tiempoCoheteReady=gameReloj.tiempo + 1;
    }

    getIsActivo(){
        return this.isActivo;
    }



    getPosicionRC() {
        return this.posicionRC;
    }

    /**Posicion relativa a la region/cuadrante*/
    getPosicionXYRel() {
        const delta = gameConfig.deltaSep;
        const sizeCM = gameCacheSize.getSizeCM();

        const x = (this.getPosicionRC().c - 1) * (sizeCM + gameConfig.wDivision) + delta;
        const y = (this.getPosicionRC().r - 1) * (sizeCM + gameConfig.wDivision) + delta;

        return new Posicion(x, y);
    }

    recibeImpacto() {
        this.isActivo = false;
    }

    ResetTiempoCoheteReady(){
        this.tiempoCoheteReady=0;
    }

    setNewTiempoCoheteReady() {
        this.tiempoCoheteReady=gameReloj.getTiempo()+gameConfig.sPrepararCohete;
    }

    ToString(){
        return `sub id:${this.id}, activo:${this.isActivo?'si':'no'},tiempoCoheteReady:${this.tiempoCoheteReady} `;
    }
}


//esto lo uso para crear los cohetes

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
//@flow

const gameData = {
    tokenRoom: null,
    canvas: null,
    ctx: null,
    jugadorLocal: null,
    listaJugadores: [],
    listaCohetes: [],
    listaMsgSocket: [],
    estado: null,
    listaZonasAtacadas:[],
    isResourcesLoaded: false,
    isCanvasLoaded: false
};


loadCanvasAndResources((imgMar, imgBullet, imgTanque
    , imgTanqueDest, imgRocket, imgExplosion
) => {
    gameConfig.resources.imgMar = imgMar;
    gameConfig.resources.imgBullet = imgBullet;
    gameConfig.resources.imgTanque = imgTanque;
    gameConfig.resources.imgTanqueDest = imgTanqueDest;
    gameConfig.resources.imgRocket = imgRocket;
    gameConfig.resources.imgExplosion = imgExplosion;
});


const gameController = {

    engine: {
        selpos: null,
        esperarParticipantes: null,
        batalla: null
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

            //se verifica si estan cargadoir
            loadCanvasAndResources((imgMar, imgBullet, imgTanque) => {
                gameConfig.resources.imgMar = imgMar;
                gameConfig.resources.imgBullet = imgBullet;
                gameConfig.resources.imgTanque = imgTanque;
                this.runConfirmarPosiciones();
            });


        }
    },
    runConfirmarPosiciones: function () {

        console.log('runConfirmarPosiciones');
        gameData.estado = gameEstado.ConfirmarPosicion;

        let fnOnConfirmar = () => {
            gameController.runEsperarParticipantes();

            this.engine.selpos = null;
        };

        this.engine.selpos = new EngineSelPos(fnOnConfirmar);
        this.engine.selpos.run();

    },
    runEsperarParticipantes: function () {

        console.log('runEsperarParticipantes');
        gameData.estado = gameEstado.EsperarParticipantes;

        let fnOnContinuar = () => {

            this.engine.esperarParticipantes = null;
            gameData.ctx.fillStyle = `rgb(0, 0, 0)`;
            gameData.ctx.fillRect(0, 0, gameConfig.size, gameConfig.size);
            gameController.runBatalla();
        };

        this.engine.esperarParticipantes = new EngineEsperar(fnOnContinuar);
        this.engine.esperarParticipantes.run();

    },
    runBatalla: async function () {
        console.log('runBatalla');
        gameData.estado = gameEstado.Batalla;

        gameAudio.getInstance().startBG();

        let fnOnContinuar = () => {


            this.engine.esperarParticipantes = null;

            gameData.ctx.fillStyle = `rgb(0, 0, 0)`;
            gameData.ctx.fillRect(0, 0, gameConfig.size, gameConfig.size);

            gameController.runTerminoBatalla();


        };

        let pausa = await setTimeout(() => {
            return true;
        }, 2000);

        gameReloj.start();
        let engine = new EngineBatalla(fnOnContinuar);
        this.engine.batalla = engine;

        engine.run();

    },
    runTerminoBatalla: function () {
        gameData.estado = gameEstado.TerminoBatalla;
        console.log('batalla terminada');
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

        const origen = gameData.jugadorLocal.getOrigenFromIndex();
        const sizeCM = gameCacheSize.getSizeCM();

        const posRel=submarino.getPosicionXYRel();

        const x = origen.x + posRel.x;
        const y = origen.y + posRel.y;

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
        ctxCache.font = '18px monospace';
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

        this.addEventosMouseAndKeyboard();

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
        this.jugadorLocal.isPosicionConfirmada=true;
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

        }

        frame();

    }

};
/* @flow */

class EngineEsperar extends AEngine {

    constructor(fnOnContinuar) {

        super(fnOnContinuar);


        this.estado = '';
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

        this.estado = 'oscurecer';

        drawEsperar.oscurecer(ctx, fnCallback);
    }

    onJugadorRemotoConfirma() {
        const ctx = this.ctx;
        let numJugadores = gameData.listaJugadores.length;

        let numConfirmados = gameData.listaJugadores
            .filter(j => {
                return j.isPosicionConfirmada;
            }).length;

        if (this.estado !== 'saliendo') {
            //poner el texto caundots jugadores estan confirmados
            drawEsperar.actualizarTextoEspera(ctx, numJugadores, numConfirmados);
        }

        if (numJugadores === numConfirmados) {
            this.estado = 'saliendo';
            setTimeout(this.fnOnContinuar, 2000);
        }




    }

}
//@flow
"use strict";

const drawBatallaAllRegions = {

    exe: function (ctx) {

        let cacheMar = this.getCacheCanvasAll();
        ctx.drawImage(cacheMar, 0, 0, gameConfig.size, gameConfig.size);

    },
    cacheRegionAll: null,
    getCacheCanvasAll: function () {

        //vamos a dibujar todos los jugadores
        if (this.cacheRegionAll !== null) {
            return this.cacheRegionAll;
        }

        const sizeRegion = gameCacheSize.getSizeRegion();
        const delta = gameConfig.deltaSep;

        //este canvas tendra todo el mapa
        const cacheCanvas = document.createElement('canvas');
        cacheCanvas.width = gameConfig.size;
        cacheCanvas.height = gameConfig.size;

        const ctx = cacheCanvas.getContext('2d');

        //blanco para reslatar el cambio ----------------------------------------
        ctx.fillStyle = 'darkslategray';
        ctx.fillRect(0, 0, gameConfig.size, gameConfig.size);

        //dibujar el sector de jugador local con sus submarinos -----------------

        const sizeMar = sizeRegion - 2 * delta;
        const sizeDiv = (sizeRegion - (gameConfig.wDivision * gameConfig.numDivisiones)) / gameConfig.numDivisiones;
        const rayaSize = sizeRegion - 2 * delta;
        const sizeCM = (sizeMar - gameConfig.numDivisiones * gameConfig.wDivision) / gameConfig.numDivisiones;


        let wCohete = 36;
        let hCohete = 24;


        function drawSeccionFromOrigen(origen, indexJugador) {
            ctx.fillStyle = '#000000';
            ctx.fillRect(origen.x, origen.y, sizeRegion, sizeRegion);

            //la seccion de mar
            ctx.drawImage(gameConfig.resources.imgMar, 0, 0, sizeMar, sizeMar, delta + origen.x, delta + origen.y, sizeMar, sizeMar);

            ctx.fillStyle = "rgba(255, 255, 255, 0.7)";

            for (let i = 1; i < gameConfig.numDivisiones; i++) {
                let xCuadro = origen.x + i * (sizeCM + gameConfig.wDivision) + delta;
                let yCuadro = origen.y + delta;
                ctx.fillRect(xCuadro, yCuadro, gameConfig.wDivision, rayaSize);

                xCuadro = origen.x + delta;
                yCuadro = origen.y + i * (sizeCM + gameConfig.wDivision) + delta;
                ctx.fillRect(xCuadro, yCuadro, rayaSize, gameConfig.wDivision);
            }


            if(indexJugador===1){
                ctx.drawImage(gameConfig.resources.imgBullet, 0, 0, wCohete, hCohete,
                    origen.x + delta - 2,
                    origen.y + 2,
                    wCohete * .6, hCohete * .6);
            }

            ctx.font = '18px monospace';
            ctx.fillStyle = "rgba(200, 200, 200, 0.7)";
            ctx.fillText('Player ' + indexJugador.toString(), origen.x + (sizeMar - 30) / 2, origen.y + 16);


            ctx.drawImage(gameConfig.resources.imgTanque, 0, 0, 100, 100,
                origen.x + sizeMar - delta - 6,
                origen.y - 5,
                30, 30);


        }


        let listaOrigen = gameData.listaJugadores.map(j => {
            return j.getOrigenFromIndex();
        });

        listaOrigen.unshift(gameData.jugadorLocal.getOrigenFromIndex());

        let indexJugador = 0;
        listaOrigen.map(origen => {
            indexJugador++;
            drawSeccionFromOrigen(origen, indexJugador);
        });


        this.cacheRegionAll = cacheCanvas;

        return this.cacheRegionAll;
    },
    resetCacheCanvasAll: function () {
        this.cacheRegionAll = null;
    }
};
//@flow
"use strict";

const drawBatallaCohetesLocal = {

    isShowTrayectoria: false,

    exe: function (ctx, contadorFrames ,listaCohetes) {



        const imgCohete = factoryImgRocket.fromContadorFrame(contadorFrames);
        const sizeCohete = gameConfig.sizeCohete;
        const mitadSizeCohete = sizeCohete / 2;

        const spritesExplosion = gameConfig.resources.imgExplosion;
        const sizeExplosion = 50;
        const mitadSizeExplosion = sizeExplosion / 2;


        listaCohetes.forEach(c => {
            c.mover(contadorFrames);
            //console.log('trayectoria');

            //dibujar linea0
            if (this.isShowTrayectoria) {
                ctx.beginPath();
                ctx.moveTo(c.getPosicionIni().x, c.getPosicionIni().y);
                ctx.lineTo(c.getPosicionFinal().x, c.getPosicionFinal().y);
                ctx.closePath();
                ctx.stroke();
            }

            //sacar el sprite

            if (c.getIsObjetivoAlcanzado()) {

                let etapa = c.getEtapaExplosion();
                if (etapa >= 0) {
                    let x = c.getPosicionFinal().x - mitadSizeExplosion;
                    let y = c.getPosicionFinal().y - mitadSizeExplosion;
                    let sx = etapa * sizeExplosion;
                    ctx.drawImage(spritesExplosion, sx, 0, sizeExplosion, sizeExplosion, x, y, sizeExplosion, sizeExplosion);
                }

            } else {
                let x = c.getPosicion().x - mitadSizeCohete;
                let y = c.getPosicion().y - mitadSizeCohete;

                let sx = c.getAngulo() * sizeCohete;
                ctx.drawImage(imgCohete, sx, 0, sizeCohete, sizeCohete, x, y, sizeCohete, sizeCohete);
            }


        });
    },


};
//@flow
"use strict";

const drawBatallaContadores = {

    exe: function (ctx) {
        //para el jugador local
        this.contadorCohetes(ctx);

        //local y remoito
        this.contadorSubmarinos(ctx);
    },
    contadorSubmarinos: function (ctx) {

        const sizeRegion = gameCacheSize.getSizeRegion();
        const delta = gameConfig.deltaSep;

        let listaJugador = gameData.listaJugadores.map(j => {
            return j;
        });

        listaJugador.unshift(gameData.jugadorLocal);

        listaJugador.map(jugador => {

            const numSubmarino = jugador.getNumSubmarinos();
            const origen=jugador.getOrigenFromIndex();

            ctx.fillStyle = "rgba(255, 255, 0, 1)";
            ctx.font = '19px monospace';
            ctx.fillText(numSubmarino.toString(), origen.x + sizeRegion - delta - 20, origen.y + delta - 4);

        });
    },
    contadorCohetes: function (ctx) {
        const jugador = gameData.jugadorLocal;
        const origen = jugador.getOrigenFromIndex();
        const delta = gameConfig.deltaSep;

        let numCohetes = jugador.getNumCohetesReady();

        ctx.fillStyle = "rgba(255, 255, 255, 1)";
        ctx.font = '19px monospace';
        ctx.fillText(numCohetes.toString(), origen.x +  delta + 20, origen.y + delta - 4);
    }

};
//@flow
"use strict";

const drawBatallaSubmarinosLocal = {

    cacheSubmarinosLocal: null,
    exe: function (ctx) {

        const sizeRegion = gameCacheSize.getSizeRegion();

        let cache = this.getCacheSubmarinosLocal();

        let origen = gameData.jugadorLocal.getOrigenFromIndex();

        ctx.drawImage(cache, 0, 0, sizeRegion, sizeRegion, origen.x, origen.y, sizeRegion, sizeRegion);

    },

    drawSubmarino: function (ctxRegion, submarino) {

        const delta = gameConfig.deltaSep;

        const sizeCM = gameCacheSize.getSizeCM();
        const posRel= submarino.getPosicionXYRel();

        let imgSubmarino= submarino.isActivo? gameConfig.resources.imgTanque : gameConfig.resources.imgTanqueDest;

        ctxRegion.drawImage(imgSubmarino, 0, 0, 100, 100, posRel.x , posRel.y, sizeCM, sizeCM);

    },

    getCacheSubmarinosLocal: function () {

        //vamos a dibujar todos los jugadores
        if (this.cacheSubmarinosLocal !== null) {
            return this.cacheSubmarinosLocal;
        }

        const jugador = gameData.jugadorLocal;

        const sizeRegion = gameCacheSize.getSizeRegion();
        const delta = gameConfig.deltaSep;

        //este canvas tendra todo el mapa
        const cacheCanvasRegion = document.createElement('canvas');
        cacheCanvasRegion.width = sizeRegion;
        cacheCanvasRegion.height = sizeRegion;

        const ctxRegion = cacheCanvasRegion.getContext('2d');

        //los submarinos listos
        let numActivos = 0;
        jugador.getListaSubmarinos()
            .forEach(s => {

                    this.drawSubmarino(ctxRegion, s);

                    if (s.isActivo) {
                        numActivos++;
                    }
                }
            );


        this.cacheSubmarinosLocal = cacheCanvasRegion;

        return cacheCanvasRegion;

    }
};
//@flow
"use strict";

const drawBatallaZonasAtacadas = {


    exe: function (ctx) {


        const sizeCM = gameCacheSize.getSizeCM();

        //recorreer todas las zonas para ver cuales estan ya definidas
        const lista = gameData.listaZonasAtacadas
            .filter(z => {
                return z.isObjetivoAlcanzado === true;
            });

        //con cada zona hacer el dibujo

        lista.forEach(zona => {

            const posicion = zona.posicionRCC.getPosAbs();

            //dibujar zona en negro

            ctx.fillStyle = 'rgba(0,0,0,0.4)';
            ctx.fillRect(posicion.x, posicion.y, sizeCM, sizeCM);


            if (zona.isSubmarino === true) {
                let imgSubmarino=  gameConfig.resources.imgTanqueDest;
                ctx.drawImage(imgSubmarino, 0, 0, 100, 100, posicion.x , posicion.y, sizeCM, sizeCM);
            }

        });

    }

};
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

    onJugadorRemotoLanzaCohete( id_jugador, indexCuadrante, r, c){

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

//@flow
"use strict";

const factoryImgRocket = {


    fromContadorFrame: function (contador) {

        let contadorSprite= contador % 10;

        if(contadorSprite<5){
            return this.getCache1();
        }else{
            return this.getCache2();
        }


        //TODO poner que cambie de cahce

    },
    cache1: null,
    cache2: null,
    getCache1() {

        const sizeCohete = gameConfig.sizeCohete;

        if (this.cache1) {
            return this.cache1;
        }

        const canvasFrame = document.createElement('canvas');
        canvasFrame.width = sizeCohete;
        canvasFrame.height = sizeCohete;
        const ctxFrame = canvasFrame.getContext('2d');


        const wResource = 75;
        const hResource = 19;
        const alfa = sizeCohete / wResource;


        let y = (sizeCohete - hResource) / 2;


        //crear cache de todos amgulos -------------------------
        const canvasCache = document.createElement('canvas');

        //son 359 porque 360=0
        canvasCache.width = sizeCohete * 359;
        canvasCache.height = sizeCohete;

        const ctx = canvasCache.getContext('2d');


        ctxFrame.drawImage(gameConfig.resources.imgRocket, 0, 0,
            wResource, hResource, 0, y, sizeCohete, hResource * alfa);





        //es el cohete rotado en todos los ángulos
        for (let i = 0; i < 360; i++) {

            const canvasRot = document.createElement('canvas');
            canvasRot.width = sizeCohete;
            canvasRot.height = sizeCohete;
            const ctxRot = canvasRot.getContext('2d');

            ctxRot.translate(sizeCohete / 2, sizeCohete / 2);
            ctxRot.rotate(-i * Math.PI / 180);
            ctxRot.drawImage(canvasFrame, -(sizeCohete / 2), -(sizeCohete / 2));


            ctx.drawImage(canvasRot, 0, 0,
                sizeCohete, sizeCohete, i * sizeCohete, 0, sizeCohete, sizeCohete);

            ctxRot.restore();

        }


        this.cache1 = canvasCache;

        return this.cache1;

    },
    getCache2() {

        //copy paste de getCache1
        const size = 50;

        if (this.cache2) {
            return this.cache2;
        }

        const canvasFrame = document.createElement('canvas');
        canvasFrame.width = size;
        canvasFrame.height = size;
        const ctxFrame = canvasFrame.getContext('2d');


        const wResource = 75;
        const hResource = 19;
        const alfa = size / wResource;


        let y = (size - hResource) / 2;


        //crear cache de todos amgulos -------------------------
        const canvasCache = document.createElement('canvas');
        canvasCache.width = size * 359;
        canvasCache.height = size;

        const ctx = canvasCache.getContext('2d');


        /*este frame es desplazado del sprint */
        ctxFrame.drawImage(gameConfig.resources.imgRocket, wResource, 0,
            wResource, hResource, 0, y, size, hResource * alfa);





        //es el cohete rotado en todos los ángulos
        for (let i = 0; i < 360; i++) {

            const canvasRot = document.createElement('canvas');
            canvasRot.width = size;
            canvasRot.height = size;
            const ctxRot = canvasRot.getContext('2d');

            ctxRot.translate(size / 2, size / 2);
            ctxRot.rotate(-i * Math.PI / 180);
            ctxRot.drawImage(canvasFrame, -(size / 2), -(size / 2));


            ctx.drawImage(canvasRot, 0, 0,
                size, size, i * size, 0, size, size);

            ctxRot.restore();


        }


        this.cache2 = canvasCache;

        return this.cache2;
    },

};
const gameAudio = (function () {

    let _instance = null;


    function init() {

        const sounds = {
            "disparo": {
                url: "sonido/disparo.mp3"
            },
            "explosion": {
                url: "sonido/explosion.wav"
            },
            "main": {
                url: "sonido/main.mp3",
                duracion: 197,
                volume:0.6
            },
        };

        function loadSound(name) {
            var sound = sounds[name];

            var url = sound.url;
            var buffer = sound.buffer;

            var request = new XMLHttpRequest();
            request.open('GET', url, true);
            request.responseType = 'arraybuffer';

            request.onload = function () {
                soundContext.decodeAudioData(request.response, function (newBuffer) {
                    sound.buffer = newBuffer;
                });
            };

            request.send();
        }

        for (var key in sounds) {
            loadSound(key);
        }

        var soundContext = new AudioContext();


        function playSound(name) {
            var sound = sounds[name];
            var soundVolume = sounds[name].volume || 1;

            var buffer = sound.buffer;
            if (buffer) {
                var source = soundContext.createBufferSource();
                source.buffer = buffer;

                var volume = soundContext.createGain();

                volume.gain.value = soundVolume;

                volume.connect(soundContext.destination);
                source.connect(volume);
                source.start(0);
            }
        }


        let playBG = () => {
            playSound('main', 0.6);
        };

        let idSoundBG = null;
        return {
            load:()=>{
              return true;
            },
            startBG: () => {
                if(!gameConfig.isAudio){
                    return;
                }

                playSound('main');
                idSoundBG = setInterval(playBG, sounds.main.duracion * 1000)
            },
            stopBG: () => {
                if(!gameConfig.isAudio){
                    return;
                }

                clearInterval(idSoundBG);
            },
            lanzamiento: () => {
                if(!gameConfig.isAudio){
                    return;
                }

                playSound('disparo');
            },
            explosion:()=>{
                if(!gameConfig.isAudio){
                    return;
                }

                playSound('explosion')
            }
        };
    }

    return {
        getInstance: () => {
            if (_instance === null) {
                _instance = init();
            }

            return _instance;
        }
    }

})();


gameAudio.getInstance().load();

//@flow
"use strict";

class ACohete {

    constructor(posicionIni, id_jugador, indexCuadrante) {
        this.id = IDGenerator('c');
        this.posicionIni = posicionIni;
        this.posicionFinal = null;
        this.posicion = posicionIni.clonar();

        this.estado = 'ready';
        this.velocidad = new Posicion(0, 0, 0);
        this.angulo = null;

        this.distancia = 0;
        this.distanciaAvanzada = 0;

        this.etapaExplosion = 0;
        this.frameIniciaExplosion = 0;


        this.id_jugador = id_jugador;
        this.callbackAlLanzar = null;
        this.callbackAlExplotar = null;

        this.indexCuadrante = indexCuadrante;
        this.isLocal = null;
    }

    getEtapaExplosion() {
        return this.etapaExplosion;
    }

    getIsEstadoReady() {
        return this.estado === 'ready';
    }

    getIsEstadoLanzado() {
        return this.estado === 'lanzado';
    }

    getAngulo() {
        return this.angulo;
    }

    lanzar(posicionFinal) {
        console.log(`cohete lanzado ${this.id}`);
        this.estado = 'lanzado';
        this.posicionFinal = posicionFinal;

        //centrar el cuadrantes
        this.posicionFinal.x += gameCacheSize.getSizeCM() / 2;
        this.posicionFinal.y += gameCacheSize.getSizeCM() / 2;


        //definir velocidades y angulo -----------------------

        const dx = this.posicionFinal.x - this.posicionIni.x;

        /*el sitema de coordenadas en y esta invertido, por eso es negativo*/
        const dy = -(this.posicionFinal.y - this.posicionIni.y);


        const distancia = Math.sqrt(dx ** 2 + dy ** 2);


        //la distancia que veremos que avance es menos por que le quitamos las diemnsione sdel sprite
        this.distancia = distancia - Math.sqrt(gameConfig.sizeCohete ** 2 + gameConfig.sizeCohete ** 2) / 4;


        this.velocidad.x = dx / distancia;

        //como y es un eje invertido la velocidad debe ser con negativo
        this.velocidad.y = -dy / distancia;

        this.angulo = Math.atan(dy / dx);

        const isDyNegativo = dy < 0;
        const isDxNegativo = dx < 0;


        //conversion a grados
        this.angulo = this.angulo * (180 / Math.PI);

        //redondear para usar cache de grados integeer
        this.angulo = Math.round(this.angulo);


        //este es de donde sale el cohete
        const indexCuadrante = this.indexCuadrante;


        //TRANSFORMACION DEL ANGULO - DEPENDE DEL CUADRANTE
        console.log('indexCuadrante ' + indexCuadrante.toString());

        //const anguloOriginal = this.angulo; //<- es para debuig

        if (isDxNegativo) {
            if (this.angulo === 0) {
                this.angulo = 180;

            } else if (this.angulo < 0) {

                if (isDyNegativo) {
                    this.angulo -= 360;
                } else {
                    this.angulo += 180;
                }
            }else{
                if(isDyNegativo){
                    this.angulo += 180;
                }
            }
        } else {

            if (isDyNegativo) {
                if (this.angulo === 0) {

                } else if (this.angulo < 0) {
                    this.angulo += 360;
                }

            }
        }


        //console.log(`cuadrante :: angulo original -> angulo transformado   ${indexCuadrante}:: ${anguloOriginal} -> ${this.angulo} | ${isDxNegativo ? 'isDxNegativo' : ''} ${isDyNegativo ? 'isDyNegativo' : ''}`);


        //----------------------------------------------------

        if (this.callbackAlLanzar) {
            this.callbackAlLanzar();
        }
    }

    mover(contadorFrames) {

        if (this.getIsObjetivoAlcanzado()) {

            //actualizar
            if (this.frameIniciaExplosion === 0) {
                this.frameIniciaExplosion = contadorFrames;
                //mandar mensaje de explosion si es local
            }
            const duracionFrame = 7;


            this.etapaExplosion = Math.floor((contadorFrames - this.frameIniciaExplosion) / duracionFrame);

            if (this.etapaExplosion >= 7) {
                this.estado = 'explotado';
                this.etapaExplosion = 6;

                //poner que ya se alcanzo el objetivo
                const zona = gameData.listaZonasAtacadas
                    .find(z => {
                        return z.idCohete === this.id;
                    });
                //esta propiedad es la que se usa para draw
                zona.isObjetivoAlcanzado = true;

                if (this.callbackAlExplotar) {
                    this.callbackAlExplotar(zona);
                }
            }


        } else {
            this.posicion.x += this.velocidad.x;
            this.posicion.y += this.velocidad.y;
            this.distanciaAvanzada += 1;
        }

    }

    getIsObjetivoAlcanzado() {
        return this.distanciaAvanzada >= this.distancia;
    }


    getPosicionIni() {
        return this.posicionIni;
    }

    getPosicionFinal() {
        return this.posicionFinal;
    }

    getPosicion() {
        return this.posicion;
    }
}
//@flow
"use strict";

class CoheteLocal extends ACohete {

    constructor(posicionIni, id_jugador, id_submarino) {
        super(posicionIni, id_jugador,0);
        this.isLocal=true;

        this.id_submarino = id_submarino;

        this.callbackAlLanzar = () => {

            console.log(`allanzar id_cohete ${this.id}, el submarino es ${this.id_submarino}`);

            // al lanzar vamos a buscar al submarino que es dueño de  este cohete poara volverlo a mandar
            let submarino = gameData.jugadorLocal.getListaSubmarinos()
                .find(s => {
                    return s.id === this.id_submarino;
                })
            ;

            if (submarino) {
                //console.log(`preparar submarino ${id_submarino}`);

                submarino.setNewTiempoCoheteReady();

                //console.log(`nuevo tiempo del submarino ${id_submarino} es ${submarino.tiempoCoheteReady}`);
            }

            gameAudio.getInstance().lanzamiento();

        };

        this.callbackAlExplotar = (zona) => {
            //TODO enviar mensaje de que atacamos a algien


        }

    }

}


//@flow
"use strict";

class CoheteRemoto extends ACohete {


    constructor(jugador) {

        //poner del origen en el centro del mar

        const origen = factoryPosicionRCCuadrante.getOrigenCuadrante(jugador.indexCuadrante);

        origen.x += gameCacheSize.getSizeRegion() / 2;
        origen.y += gameCacheSize.getSizeRegion() / 2;


        super(origen, jugador.id, jugador.indexCuadrante);
        this.isLocal = false;

        //inmediatametne se cra se lanza


        this.callbackAlLanzar = () => {
            console.log(`player ataca id_cohete ${this.id}, el jugador es ${this.id}`);
        };


        this.callbackAlExplotar = (zona) => {


            //este procedimeinto tiene la funcion de evaluar si el coehte remoto alcanzo un submarino local

            if (zona.indexCuadrante !== 0) {
                //si no es una zona del jugador local salimos
                return;
            }


            //buscamos si alcanzaron un submarino local ---------------------------------

            let rZona = zona.posicionRCC.posicionRC.r;
            let cZona = zona.posicionRCC.posicionRC.c;


            let submarino = gameData.jugadorLocal.listaSubmarinos
                .find(s => {
                    return s.posicionRC.r === rZona && s.posicionRC.c === cZona;
                });


            if (submarino) {
                //esta en un submarino debemnos de poner estado como explotado

                gameAudio.getInstance().explosion();

                //TODO mandar mensaje al sockete de que nos destruyeron un submarino


                submarino.isActivo = false;
                //buscar si el submarino tiene un cohete ready y quitarlos
                let coheteLocal = gameData.jugadorLocal.listaCohetes
                    .find(c => {
                        return c.id_submarino === submarino.id && c.getIsEstadoReady();
                    });

                if (coheteLocal) {
                    coheteLocal.estado = 'explotado';
                }

                zona.isSubmarino = true;

            } else {
                zona.isSubmarino = false;
            }

            let  numSubActivos= gameData.jugadorLocal.listaSubmarinos
                .filter(s=>{
                    return s.getIsActivo();
                }).length;

            let isRendicion=numSubActivos>0;

            let msg=factoryMensajeSocket.ResultadoAtaque( gameData.jugadorLocal.id,  rZona, cZona,   zona.isSubmarino, isRendicion);
        };

    }

}


//@flow
"use strict";


const factoryCohete = {
    jugadorLocal: function (submarino) {

        //let posicion= submarino.

        let jugador = gameData.jugadorLocal;

        let origen = jugador.getOrigenFromIndex();
        let posRel = submarino.getPosicionXYRel();

        const sizeCM = gameCacheSize.getSizeCM();

        let x = origen.x + posRel.x + sizeCM / 2;
        let y = origen.y + posRel.y + sizeCM / 2;

        let posicionCentroCohete = new Posicion(x, y);

        //el cohete sale de este cuadrante
        const indexCuadrante=0;

        return new CoheteLocal(posicionCentroCohete, jugador.id, submarino.id, indexCuadrante);

    }

};

/* @flow */
const tipoMsgSocket = {
    solicitar_ingresar_room: 'ingresa',
    sale: 'sale',
    confirma_posiciones: 'confirma_posiciones',

    lanza_cohete: 'lanza_cohete',
    resultado_ataque: 'resultado_ataque',
};


const factoryMensajeSocket = {
    JugadorIngresa: function (id_jugador) {
        return {
            token: gameData.tokenRoom,
            id_jugador,
            tipo: tipoMsgSocket.solicitar_ingresar_room
        };
    },
    JugadorConfirma: function (id_jugador) {
        return {
            token: gameData.tokenRoom,
            id_jugador,
            tipo: tipoMsgSocket.confirma_posiciones
        }
    },
    LanzaCohete: function (id_jugador, id_jugador_recibe_ataque, r, c) {

        return {
            token: gameData.tokenRoom,
            id_jugador,
            id_jugador_recibe_ataque,
            tipo: tipoMsgSocket.lanza_cohete,
            r,
            c
        }

    },
    ResultadoAtaque: function (id_jugador,  r, c, isSubmarino, isRendicion) {

        return {
            token: gameData.tokenRoom,
            id_jugador,
            tipo: tipoMsgSocket.resultado_ataque,
            r,
            c,
            isSubmarino,
            isRendicion
        }

    }
};
/* @flow */

const proRecibirMsgSocket = {
    exe: function (msg) {

        //buscar al jugador qeu envia el ataque
        const jugador = this.getJugadorFromId(msg.id_jugador);

        //si es del jugador local / nbosotros msimos no hacemos nada
        if (msg.id_jugador === gameData.jugadorLocal.id) {
            return;
        }


        if (msg.tipo === tipoMsgSocket.solicitar_ingresar_room) {
            this.jugador_ingresa(jugador);


        } else if (msg.tipo === tipoMsgSocket.confirma_posiciones) {
            this.jugador_confirma_posicion(jugador)

        } else if (msg.tipo === tipoMsgSocket.lanza_cohete) {
            this.lanza_cohete(msg)

        } else if (msg.tipo === tipoMsgSocket.resultado_ataque) {
            this.resultado_ataque(jugador, msg);

        } else {
            alert("no esperamos este tipo de mensaje " + msg.tipo)
        }


    },
    jugador_ingresa: function (jugador) {

    },
    jugador_confirma_posicion: function (jugador) {

        jugador.setPosicionConfirmada();

        //notificar al controller - si no esta en la etapa de espera

        if (gameController.engine.esperarParticipantes) {
            gameController.engine.esperarParticipantes.onJugadorRemotoConfirma();
        }

    },
    lanza_cohete: function (msg) {

        let indexCuadranteAtacado = null;

        if (msg.id_jugador_recibe_ataque === gameData.jugadorLocal.id) {
            indexCuadranteAtacado = 0;
        } else {
            //buscar que cuadrante tiene ese jugador
            let jugadorAtacado = gameData.listaJugadores
                .find(j => {
                    return j.id === msg.id_jugador_recibe_ataque;
                })
            ;

            if (jugadorAtacado) {
                indexCuadranteAtacado = jugadorAtacado.getIndexCuadrante();
            }
        }

        if (indexCuadranteAtacado !== null) {
            gameController.engine.batalla.onJugadorRemotoLanzaCohete(msg.id_jugador, indexCuadranteAtacado, msg.r, msg.c);
        }


    },
    resultado_ataque: function (jugador, msg) {
        //buscar la zona que se ataco y marcarla

        let zona = gameData.listaZonasAtacadas
            .find(z => {
                    let rZona = z.posicionRCC.posicionRC.r;
                    let cZona = z.posicionRCC.posicionRC.c;

                    return z.id_jugador === jugador.id && msg.r === rZona && msg.c === cZona;
                }
            );


        let isZonaNueva = false;

        if (!zona) {
            //crear la zona

            isZonaNueva = true;

            const indexCuadrante = jugador.getIndexCuadrante();
            const pos = new PosicionRCCuadrante(indexCuadrante, new PosicionRC(msg.r, msg.c));
            zona = factoryZonaAtacada.exe(pos, null, jugador.id);
            gameData.listaZonasAtacadas.push(zona);
        }


        zona.isObjetivoAlcanzado = true;

        if (zona.isSubmarino !== true && msg.isSubmarino) {
            zona.isSubmarino = true;
            jugador.onSubmarinoDestruido();
        }else{
            zona.isSubmarino = msg.isSubmarino;
        }




        //si destruyeon un submarino evaluar si ya ganamos
        if (zona.isSubmarino) {

            //ver cuantos jugadores quedan

            let numJugadores = gameData.listaJugadores
                .filter(j => {
                    return j.getNumSubmarinos() > 0;
                })
                .length
            ;

            if (numJugadores === 0) {
                alert("ganaste");
            }


        }

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
/* @flow */

class Posicion {

    constructor(x, y, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    toString() {
        return `${this.x}, ${this.y}`;
    }

    clonar() {
        return new Posicion(this.x, this.y, this.z);
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


    getPosAbs() {
        const delta = gameConfig.deltaSep;
        const sizeCM = gameCacheSize.getSizeCM();
        const origenCuadrante = factoryPosicionRCCuadrante.getOrigenCuadrante(this.indexCuadrante);


        const x = origenCuadrante.x + (this.getC() - 1) * (sizeCM + gameConfig.wDivision) + delta;

        const y = origenCuadrante.y + (this.getR() - 1) * (sizeCM + gameConfig.wDivision) + delta;

        return new Posicion(x, y, 0);
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
/*FBUILD*/ console.log( 'FBUILD-20190611 08:11');  /*FBUILD*/

//# sourceMappingURL=app.js.map
