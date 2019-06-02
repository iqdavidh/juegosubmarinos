/* @flow */

const gameConfig = {
    size: 800,
    numSubmarinos: 3,
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
let EventoDummy = {

    addJugador2:function(){
        let j= factoryJugador.
        gameEngine.addJugador( j);
    }
};
class AJugador {

    constructor(indexCuadrante) {
        this.indexCuadrante = indexCuadrante;
        this.id = parseInt(Math.random() * 100000);
        this.isPosicionConfirmada = false;

        this.getIsLocal = () => {
            return indexCuadrante===0;
        };

        this.listaAtaquesRecibidos = [];
        this.listaCohetes = [];

    }
}
class Cohete {

    constructor(posicionIni) {
        this.posicionIni = posicionIni;
        this.velocidad=new Posicion(0,0,0)
        this.posicion=null;
    }

    lanzar(posicionFinalRC, posicionFinal ) {
        this.posicionFinal = posicionFinal;
        this.posicionFinalRC = posicionFinalRC;

    }

    mover(){

    }

}
class GameEngine  {

    constructor(jugadorLocal){
        this.listaJugadores=[ jugadorLocal] ;
    }

    addJugador(jugador){
        this.listaJugadores.push(jugador);
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
class Posicion {

    constructor(x, y, z) {
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
    start: function () {

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
            this.reload();
        });

    },
    reload:function(){

        let jugadorLocal=factoryJugador.local();

        gameEngine=new GameEngine( jugadorLocal);
    }

};



/*FBUILD*/ console.log( 'FBUILD-20190602 00:25');  /*FBUILD*/

//# sourceMappingURL=app.js.map
