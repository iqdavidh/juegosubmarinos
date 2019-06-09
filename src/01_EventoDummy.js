//@flow

let EventoDummy = {

    token: '*token*',

    iniciar2Jugadores: function () {


        let msg = {
            id_jugador: 2000,
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

        let msg = factoryMensajeSocket.JugadorConfirma(this.token, j.id);


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

    iniciar3Jugadores: function () {
        this.iniciar2Jugadores();


        let msg = {
            id_jugador: 'player-dumy2',
            token: this.token
        };

        let jugador3 = factoryJugadorRemoto.fromMsgJugadorIngresa(msg);
        gameData.listaJugadores.push(jugador3);
    },

    simularJugadorRemotoAtaca: function () {

        let id = gameData.listaJugadores[0].id;
        let token = gameData.tokenRoom;


        //ver que no sea una zona atacada
        let lista = gameData.listaZonasAtacadas
            .filter(z => {
                return z.indexCuadrante === 0;
            })
        ;

        let numAtaques = lista.length;


        let r = 1;
        let c = numAtaques + 1;

        if(c>4){
            c=numAtaques-3;
            r++;
        }


        let msg = factoryMensajeSocket.LanzaCohete(token, id, 0, r, c)
        gameController.onRecibirMensajeSocket(msg);

    }
};