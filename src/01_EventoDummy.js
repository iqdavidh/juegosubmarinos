//@flow

let EventoDummy = {

    token:'*token*',

    iniciar2Jugadores: function () {

        gameController.onRegistroSocket(this.token);

        let msg = {
            id_jugador: 2000,
            token: this.token
        };

        let jugador2 = factoryJugadorRemoto.fromMsgJugadorIngresa(msg);
        gameData.listaJugadores.push(jugador2);

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

        let msg=factoryMensajeSocket.JugadorConfirma( this.token, j.id);


        gameController.onRecibirMensajeSocket(msg);
    }
    ,
    iniciar2JugadoresyConfirmar:function(){



        this.iniciar2Jugadores();
        this.confirmaJugadorRemoto();
        //confirma jugador local
        let fn=()=>{
            gameController.engine.selpos.onKeyDow({code:"Enter"});
        };
        setTimeout(fn,1000);





    },

    iniciar3Jugadores:function() {
        this.iniciar2Jugadores();



        let msg = {
            id_jugador: 3000,
            token: this.token
        };

        let jugador3 = factoryJugadorRemoto.fromMsgJugadorIngresa(msg);
        gameData.listaJugadores.push(jugador3);
    }
};