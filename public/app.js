const gameConfig = {
    size :800,
    numSubmarinos:3
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
function factoryListaSubmarinoRandom(jugador = null) {


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
            let submarino = new Submarino(posicionRC, jugador);
            lista.push(submarino);
        }

    }


    return lista;
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
let EventoDummy = {};
class GameEngine  {

    constructor(){

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
class Jugador {

    constructor(indexCuadrante , listaSubmarinos){
        this.indexCuadrante=indexCuadrante;
        this.listaSubmarinos=listaSubmarinos;
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

    constructor(posicionRC , jugador) {
        this.posicionRC=posicionRC;
        this.isActivo=true;
        this.isCoheteListo=false;
        this.jugador=jugador;
    }

    getPosicionRC(){
        return this.posicionRC;
    }

    recibeImpacto(){
        this.isActivo=false;
        this.isCoheteListo=false;
    }

    lanzaCohete(fnCB){

    }

}
'use strict';

let gameLoader = {

    start: function () {
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


            let jugador = new Jugador( 0, lista);
            //this.ctx.drawImage(imgMar, 0, 0)
            console.log('imagen cargada');

        });

    },
    canvas: null,
    ctx: null
};

// esto no debe ejecutarse por
//gameLoader.start();
/*FBUILD*/ console.log( 'FBUILD-20190601 20:39');  /*FBUILD*/

//# sourceMappingURL=app.js.map
