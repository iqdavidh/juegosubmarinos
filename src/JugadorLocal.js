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