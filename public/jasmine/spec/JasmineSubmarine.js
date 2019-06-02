
describe('gameLoader', function () {


    describe('factoryListaSubmarinoRandom', function () {

        let lista = factoryListaSubmarinoRandom();

        it('La lista no es vacia', function () {
            expect(lista.length > 0).toBeTrue();
        });


        it('la lista tiene elementos submarinos', function () {

            lista.forEach(item => {
                expect(typeof item).toBe("object");
                expect(item.isActivo ).toBeTrue();

            });
        });

        it('los submarinos tienen posiciones diferentes ', function () {

            lista.forEach(item => {
                expect(typeof item).toBe("Submarino")
            });
        });

    });


});


