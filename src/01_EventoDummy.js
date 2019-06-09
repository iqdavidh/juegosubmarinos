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
    j1Ataca: function () {
        return this._jAtaca(1);
    },
    j2Ataca: function () {
        return this._jAtaca(2);
    },
    j3Ataca: function () {
        return this._jAtaca(3);
    },
    j4Ataca: function () {
        return this._jAtaca(4);
    },
    j5Ataca: function () {
        return this._jAtaca(5);
    },
    j6Ataca: function () {
        return this._jAtaca(6);
    },
    j7Ataca: function () {
        return this._jAtaca(7);
    },
    j8Ataca: function () {
        return this._jAtaca(8);
    },


    _jAtaca: function (indexCuadranteAtacante:number) {

        let idAtacante = null;

        if (indexCuadranteAtacante === 0) {
            idAtacante = gameData.jugadorLocal.id;
        } else {
            idAtacante = gameData.listaJugadores
                .find(j => {
                    return j.indexCuadrante === indexCuadranteAtacante;
                })
                .id
            ;
        }


        for (indexCuadrante = 0; indexCuadrante < 9; indexCuadrante++) {

            if (indexCuadrante !== indexCuadranteAtacante) {

                let j = null;

                if (indexCuadrante === 0) {
                    j = gameData.jugadorLocal;
                } else {

                    j = gameData.listaJugadores
                        .find(item => {
                            return item.indexCuadrante === indexCuadrante;
                        });
                }


                let msg = factoryMensajeSocket.LanzaCohete(idAtacante, j.id, 1, 1);
                gameController.onRecibirMensajeSocket(msg);


            }


        }

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
    j1Recibe:function(){
        return this._rRecibe(1);
    },
    j2Recibe:function(){
        return this._rRecibe(2);
    },
    j3Recibe:function(){
        return this._rRecibe(3);
    },
    j4Recibe:function(){
        return this._rRecibe(4);
    },
    j5Recibe:function(){
        return this._rRecibe(5);
    },
    _rRecibe:function(indexCuadrante:number){

        let id = gameData.listaJugadores.find( j=>{
            return j.indexCuadrante === indexCuadrante
        }).id;


        let msg = factoryMensajeSocket.ResultadoAtaque(id, 1, 1, false, false);
        gameController.onRecibirMensajeSocket(msg);

        msg = factoryMensajeSocket.ResultadoAtaque(id, 2, 2, true, false);
        gameController.onRecibirMensajeSocket(msg);


    }

};