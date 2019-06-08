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

    lanzaCohete(posicionEnLaMira: PosicionRCCuadrante) {

        //buscar un cohete que este en estado ready
        const cohete = this.getListaCohetes()
            .find(s => {
                return s.getIsEstadoReady();
            });

        if (cohete) {
            let posicionAbs = posicionEnLaMira.getPosAbs();

            cohete.lanzar(posicionAbs);

            //agreagamos la zona atacada
            
            let zonaAtacada=factoryZonaAtacada.exe(posicionEnLaMira, cohete.id);
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