//@flow
"use strict";

class ACohete {

    constructor(posicionIni: Posicion, id_jugador: string) {
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

        //conversion a grados
        this.angulo = this.angulo * (180 / Math.PI);

        //redondear para usar cache de grados integeer
        this.angulo = Math.round(this.angulo);


        //TODO revisarlo cuando los disparos son haciua abajo
        if (this.angulo < 0 && this.angulo > -180) {
            //console.log(`angulo ${this.angulo}`);
            this.angulo = 180 + this.angulo;
        }

        //console.log(`angulo ${this.angulo}`);

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
            }
            const duracionFrame = 10;


            this.etapaExplosion = Math.floor((contadorFrames - this.frameIniciaExplosion) / duracionFrame);

            if (this.etapaExplosion >= 7) {
                this.estado = 'explotado';
                this.etapaExplosion=6;

                //poner que ya se alcanzo el objetivo
                const zona = gameData.listaZonasAtacadas
                    .find( z=>{
                        return z.idCohete === this.id;
                    });
                //esta propiedad es la que se usa para draw
                zona.isObjetivoAlcanzado=true;
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