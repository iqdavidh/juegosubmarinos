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

    getListaSubmarinos() {
        return this.listaSubmarinos;
    }

    prepararCohetes(): void {
        this.listaSubmarinos
            .forEach(s => {
                s.prepararCohete();
            })
        ;


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

    lanzaCohete(posicionEnLaMira:PosicionRCCuadrante){
        //buscar el primer cohete que se agrego a la lista
        if( this.getNumCohetesReady() ===0){
            return;
        }

        const cohete=this.getListaCohetes()[0];

        let posicionAbs = posicionEnLaMira.getPosAbs();

        cohete.lanzar(posicionAbs);

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