describe('gameLoader', function () {


    describe('factoryListaSubmarinoRandom', function () {

        let lista = factoryListaSubmarinoRandom();

        it('La lista no es vacia', function () {
            expect(lista.length > 0).toBe(true);
        });


        it('la lista tiene elementos submarinos', function () {

            lista.forEach(item => {
                expect(typeof item).toBe("object");
                expect(item.isActivo).toBe(true);
                expect(item.isCoheteListo).toBe(false);
                expect(item.posicionRC.r>=0).toBe(true);
                expect(item.posicionRC.c>=0).toBe(true);
            });

        });

        it('los submarinos tienen posiciones diferentes ', function () {

            let listaPos = lista
                .map(submarino => {
                    return submarino.posicionRC.r.toString() + "-" + submarino.posicionRC.c.toString() ;
                })
            ;

            //quitar elementos repetidos del array
            let listaUnicos = Array.from(new Set(listaPos));

            expect(listaPos.length === listaUnicos.length).toBe(true);


        });

    });


});


