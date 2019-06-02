class Jugador {

    constructor(indexCuadrante, listaSubmarinos) {
        this.indexCuadrante = indexCuadrante;


        this.getIsLocal = () => {
            return indexCuadrante === 0;
        };

        this.listaSubmarinos = listaSubmarinos;
        this.listaCohetes = [];

        //asignar los submarinos al jugador actual
        this.listaSubmarinos
            .forEach(submarino => {
                submarino.setJugador(this);
            })
        ;

    }
}


const factoryJugador = {
    local: function () {
        let listaSubmarinos = factoryListaSubmarinos.random();
        return new Jugador(0, listaSubmarinos);
    }
};