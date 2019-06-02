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