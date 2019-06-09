//@flow
"use strict";

class ACohete {

    constructor(posicionIni: Posicion, id_jugador: string, indexCuadrante: number) {
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

    getEtapaExplosion(): number {
        return this.etapaExplosion;
    }

    getIsEstadoReady(): string {
        return this.estado === 'ready';
    }

    getIsEstadoLanzado(): string {
        return this.estado === 'lanzado';
    }

    getAngulo(): number {
        return this.angulo;
    }

    lanzar(posicionFinal: Posicion): void {
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

    mover(contadorFrames: number): void {

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

    getIsObjetivoAlcanzado(): boolean {
        return this.distanciaAvanzada >= this.distancia;
    }


    getPosicionIni(): Posicion {
        return this.posicionIni;
    }

    getPosicionFinal(): Posicion {
        return this.posicionFinal;
    }

    getPosicion(): Posicion {
        return this.posicion;
    }
}