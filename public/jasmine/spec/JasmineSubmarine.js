describe('submarines', function () {


    describe('factoryListaSubmarino', function () {

        let lista = factoryListaSubmarinos.random();

        it('La lista no es vacia', function () {
            expect(lista.length > 0).toBe(true);
        });


        it('la lista tiene elementos submarinos', function () {

            lista.forEach(item => {
                expect(typeof item).toBe("object");
                expect(item.isActivo).toBe(true);
                expect(item.isCoheteListo).toBe(false);
                expect(item.posicionRC.r >= 0).toBe(true);
                expect(item.posicionRC.c >= 0).toBe(true);
            });

        });

        it('los submarinos tienen posiciones diferentes ', function () {

            let listaPos = lista
                .map(submarino => {
                    return submarino.posicionRC.r.toString() + "-" + submarino.posicionRC.c.toString();
                })
            ;

            //quitar elementos repetidos del array
            let listaUnicos = Array.from(new Set(listaPos));

            expect(listaPos.length === listaUnicos.length).toBe(true);


        });

    });


    describe('factoryJugador', function () {

        let jugadorLocal = factoryJugador.local();

        it('el jugador no es null', function () {
            expect(jugadorLocal !== null).toBe(true);
        });


        it('el jugador local cumple estado', function () {
            expect(jugadorLocal.getIsLocal()).toBe(true);

            expect(jugadorLocal.indexCuadrante === 0).toBe(true);

            expect(typeof jugadorLocal.listaSubmarinos).toBe('object');
            expect(jugadorLocal.listaSubmarinos.length > 0).toBe(true);


            expect(typeof jugadorLocal.listaCohetes).toBe('object');
            expect(jugadorLocal.listaCohetes.length === 0).toBe(true);

        });


    });


    describe('Evento Click Cavas - Confirmar Posicion en Jugador Local', function () {


        const listaPosicion = [
            [317,502,1,5],
            [329, 331, 1, 1],
            [351, 357, 2, 2],
            [445, 349,  4,2],
            [487, 493, 5, 5],
            [487, 493, 5, 5],
            [2, 331, null, null],
        ];

        it('Las coordenadas de click se traducen en posicion RC', function () {

            listaPosicion.forEach(row => {
                let x = row[0];
                let y = row[1];
                let c = row[2];
                let r = row[3];

                let pCuadrante=factoryPosicionRCCuadrante.fromXY(x,y);

                console.log(row);
                console.log(pCuadrante);

                if(r===null){
                    expect(pCuadrante === null).toBe(true);
                }else{
                    expect(pCuadrante !== null).toBe(true);
                    expect(pCuadrante.getR() === r).toBe(true);
                    expect(pCuadrante.getC() === c).toBe(true);

                    expect(pCuadrante.getIndexCuadrante() === 0).toBe(true);
                }


            });


        });






    });

});


