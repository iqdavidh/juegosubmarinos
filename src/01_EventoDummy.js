//@flow

let EventoDummy = {

    token: '*token*',

    iniciar2Jugadores: function () {


        let msg = {
            id_jugador: "2000",
            token: this.token
        };

        let jugador2 = factoryJugadorRemoto.fromMsgJugadorIngresa(msg);
        gameData.listaJugadores.push(jugador2);

        gameController.onRegistroSocket(this.token);

    },
    confirmaJugadorRemoto: function () {

        //el jugador que tenemos envia mensjae de confirmarciopn
        let j = gameData.listaJugadores
            .find(
                item => {
                    return !item.isPosicionConfirmada
                }
            )
        ;

        let msg = factoryMensajeSocket.JugadorConfirma(j.id);


        gameController.onRecibirMensajeSocket(msg);
    }
    ,
    iniciar2JugadoresyConfirmar: function () {


        this.iniciar2Jugadores();
        this.confirmaJugadorRemoto();
        // //confirma jugador local
        let fn = () => {
            gameController.engine.selpos.onKeyDow({code: "Enter"});
        };
        setTimeout(fn, 1000);

    },

    t8: function () {
        gameController.onRegistroSocket(this.token);

        //regsitrar
        for (let i = 1; i <= 8; i++) {
            let msg = {
                id_jugador: (i * 1000).toString(),
                token: gameData.tokenRoom
            };
            let j = factoryJugadorRemoto.fromMsgJugadorIngresa(msg);
            gameData.listaJugadores.push(j);
        }


        //confirmar
        gameData.listaJugadores
            .forEach(j => {

                let msg = factoryMensajeSocket.JugadorConfirma(j.id);
                gameController.onRecibirMensajeSocket(msg)

            });

        // //confirma jugador local
        let fn = () => {
            gameController.engine.selpos.onKeyDow({code: "Enter"});
        };
        setTimeout(fn, 1000);

    },

    simularJugadorRemotoAtaca: function () {

        let id = gameData.listaJugadores[0].id;


        //ver que no sea una zona atacada
        let lista = gameData.listaZonasAtacadas
            .filter(z => {
                return z.indexCuadrante === 0;
            })
        ;

        let numAtaques = lista.length;


        let r = 1;
        let c = numAtaques + 1;

        if (c > 4) {
            c = numAtaques - 3;
            r++;
        }

        let id_jugador_recibe_ataque = gameData.jugadorLocal.id;

        let msg = factoryMensajeSocket.LanzaCohete(id, id_jugador_recibe_ataque, r, c);
        gameController.onRecibirMensajeSocket(msg);

    },
    simularJ1RecibeAtaque: function (r, c, isSubmarino: false) {


        let id = gameData.listaJugadores[0].id;

        const jugador1 = gameData.listaJugadores
            .find(j => {
                return j.id === id;
            });


        let msg = factoryMensajeSocket.ResultadoAtaque(id, r, c, isSubmarino, false);
        gameController.onRecibirMensajeSocket(msg);
    },


};