"use strict";

const appController = new Vue({
        el: '#app',
        data: {
            isDebug: false,
            estadoConexion: false,
            etapa: 'inicio',
            subEtapa: 0,
            identityContador: 0,
            listaMsgRecibido: [],
            listaMsgEnviado: [],
            listaInvitacionAJuego: [],
            listaIdJugadorConfirma: new Set(),
            listaTipoMsg: [
                {tipo: 'invitacion_aceptada'},
                {tipo: 'lista_jugadores'},
                {tipo: tipoMsgSocket.confirma_posiciones},
                {tipo: tipoMsgSocket.lanza_cohete},
                {tipo: tipoMsgSocket.resultado_ataque}
            ],
            dataMsg: {},
            tipoJugador: null,
            newRoom: {
                token: null,
                numJugadores: null
            },
            unirseRoom: null,
            numJugadoresEsperados: null,
            labelIdPlayer: null,
            listaNumJugadores: [2, 3, 4, 5, 6, 7, 8, 9]
        },
        methods: {
            getLabelIdPlayer() {
                return this.labelIdPlayer;
            },
            setLabelIdPlayer(valor) {
                this.labelIdPlayer = valor;
            },
            setConexionOK() {
                this.estadoConexion = true;
            },
            onIniciarJuego() {
                this.etapa = 'ingresar_room';
                this.subEtapa = 'iniciar';
            },
            getNextIdentity() {
                this.identityContador++;
                return this.identityContador;
            },
            empezarPartidaNewRoom() {

                this.tipoJugador = 'principal';

                //Paso 1 creamos el juego (se crea el id de jugador)
                gameController.onRegistroSocket(this.newRoom.token, this.newRoom.numJugadores);
                gameData.numJugadoresEsperados = this.newRoom.numJugadores;
                console.log(gameData.jugadorLocal.id);


                this.setLabelIdPlayer(gameData.jugadorLocal.id);

                this.listaInvitacionAJuego = [];
                this.numJugadoresEsperados = this.newRoom.numJugadores;


                //Paso 2 mandar invitacion a jugadores y esperar ingreso
                let msgInvitacion = {
                    token: this.newRoom.token,
                    tipo: 'invitacion',
                    numJugadoresEsperados: this.newRoom.numJugadores,
                    idJugador: gameData.jugadorLocal.id
                };

                this.enviarMensajeSocket(msgInvitacion);


                //esperamos el juego
                //document.getElementById('container').style='block';
                this.etapa = 'juego';
                document.getElementById('panCanvas').style.display = 'block';
                gameData.canvas.style.backgroundColor = 'darkslategray';


            },
            empezarPartidaUnirse(invitacion) {

                //Paso 1 creamos el juego (se crea el id de jugador)
                gameController.onRegistroSocket(invitacion.token, invitacion.numJugadoresEsperados);
                this.tipoJugador = 'invitado';

                this.numJugadoresEsperados = invitacion.numJugadoresEsperados;
                this.setLabelIdPlayer(gameData.jugadorLocal.id);


                //Paso 2 - enviamos acepotacion para que el jugador que creo el juego nos agregue
                let msgAceptacion = {
                    token: invitacion.token,
                    tipo: 'invitacion_aceptada',
                    id_jugador: gameData.jugadorLocal.id
                }

                this.enviarMensajeSocket(msgAceptacion);


                //esperamos el juego
                this.etapa = 'juego';
                gameData.canvas.style.backgroundColor = 'darkslategray';
                document.getElementById('panCanvas').style.display = 'block';


            },
            onEventoSocket(evento, tipo) {


                if (evento.data === undefined || null) {
                    console.log('este es un evento que no data');
                    //console.log(evento);
                    return;
                }

                if (typeof evento.data !== "string") {
                    console.log('este esperamos que el data sea string -json ');
                    //console.log(evento.data);
                    return;
                }

                //ya es seguro tener el data
                let data = JSON.parse(evento.data);

                //Como filtro solo vamos a mostrar los mensajes que son de este gametoken

                if (this.etapa === 'juego') {

                    if (data.tipo === 'invitacion' && data.idJugador === gameData.jugadorLocal.id) {
                        console.log('se recibio invitacion del mismo jugador');
                        return;
                    }


                }


                this.listaMsgRecibido.unshift(
                    {
                        id: this.getNextIdentity(),
                        data: data,
                        eventoTipo: tipo
                    }
                );

                //Ya tenemos un evento del socket que es parte del juego
                if (data.tipo === 'invitacion' && this.etapa !== 'juego') {

                    this.listaInvitacionAJuego.push({
                        token: data.token,
                        numJugadoresEsperados: data.numJugadoresEsperados,
                        idJugadorCreador: data.idJugador
                    });

                    return;
                }


                if (data.tipo === 'invitacion_aceptada') {

                    if (this.etapa === 'juego' && data.token !== gameData.tokenRoom) {
                        //si estamos en juego no hacemos caso a las invitaciones
                        return;
                    }

                    if (this.tipoJugador === 'principal') {

                        //estamos en el caso cuando un jugador local invito a jugadores y aceptaron
                        if (gameData.listaJugadores.length < (this.numJugadoresEsperados - 1)) {

                            //si faltan jugadores los agrtegamos
                            let j = factoryJugadorRemoto.fromMsgJugadorIngresa({
                                id_jugador: data.id_jugador,
                                token: data.token
                            });
                            gameData.listaJugadores.push(j);

                            //ver si ya estan todos los jugadores

                            let numJugadores = gameData.listaJugadores.length + 1;

                            if (numJugadores === this.numJugadoresEsperados) {

                                //enviar mensaje con lista de jugadores
                                let listaJugadores = gameData.listaJugadores
                                    .map(j => {
                                        return j.id;
                                    })
                                ;

                                listaJugadores.push(gameData.jugadorLocal.id);

                                let msg = {
                                    token: gameData.tokenRoom,
                                    tipo: 'lista_jugadores',
                                    lista: listaJugadores
                                }

                                this.enviarMensajeSocket(msg);

                            }
                        }


                    } else {
                        console.log('jugador invitado recibe invitacion aceptada')
                    }


                    return;
                }


                if (data.tipo === 'lista_jugadores') {

                    if (this.etapa === 'juego' && data.token !== gameData.tokenRoom) {
                        //si estamos en juego no hacemos caso a las invitaciones
                        return;
                    }

                    if (this.tipoJugador === 'invitado') {
                        //agregar a todos los jugaores, en al lista viene tambien el jugadoir local asi que no debemos agregarloi


                        data.lista
                            .filter(id => {
                                return id !== gameData.jugadorLocal.id;
                            })
                            .forEach(id => {


                                let j = factoryJugadorRemoto.fromMsgJugadorIngresa({
                                    id_jugador: id,
                                    token: gameData.tokenRoom
                                });

                                gameData.listaJugadores.push(j);

                            })
                        ;
                    } else {
                        console.log('jugador prioncipal recibe lista de jugadores')
                    }


                    return;
                }

                //vamos ainterceptar la confirmacion porque vamos a ponerla centalizada

                if (data.tipo === 'confirma_posiciones') {

                    if (this.etapa === 'juego' && data.token !== gameData.tokenRoom) {
                        //si estamos en juego no hacemos caso a las invitaciones
                        return;
                    }

                    if (this.tipoJugador === 'principal') {
                        //agregar a todos los jugaores, en al lista viene tambien el jugadoir local asi que no debemos agregarloi


                        this.listaIdJugadorConfirma.add(data.id_jugador);

                        //aqui debe llegar tambien la confirmacion del jugador princiapl
                        if (this.listaIdJugadorConfirma.size === (this.numJugadoresEsperados )) {

                            let msg = {
                                token: gameData.tokenRoom,
                                tipo: 'todos_los_jugadores_confirmaron'
                            }

                            this.enviarMensajeSocket(msg);
                        }


                    } else {
                        console.log('jugador invitador recibe confirma_posiciones')
                    }

                    return;
                }


                if (data.tipo === 'todos_los_jugadores_confirmaron') {

                    //todos los jugadores recibirn este evento para asegurar que inician al mismo tiempo

                    if (this.etapa === 'juego' && data.token !== gameData.tokenRoom) {
                        //si estamos en juego no hacemos caso a las invitaciones
                        return;
                    }

                    gameData.listaJugadores.forEach(j => {
                        j.setPosicionConfirmada();

                        if (gameController.engine.esperarParticipantes) {
                            gameController.engine.esperarParticipantes.onJugadorRemotoConfirma();
                        }

                    });

                    return;
                }


                //estos eventos propios del juego
                proRecibirMsgSocket.exe(data);
            },
            recibirOnOpen(evento) {
                this.setConexionOK();

                let data = {
                    type: evento.type,
                    timeStamp: evento.timeStamp,
                    target: evento.target
                }

                this.listaMsgRecibido.unshift(data);
            },
            recibirOnClose(evento) {
                return this.onEventoSocket(evento, 'recibirOnClose');
            },
            recibirOnMesagge(evento) {
                return this.onEventoSocket(evento, 'recibirOnMesagge');
            },
            recibirOnError(evento) {
                console.log('error del socket - TODO ver porque')
                console.log(evento);
            },
            enviarMensajeSocket(data) {

                data.type = 'message';
                ws.send(JSON.stringify(data));

                this.listaMsgEnviado.push(data);
            },
            enviarMensajeAtaque(id_jugador_recibe_ataque, r, c) {

                let msg = factoryMensajeSocket.LanzaCohete(gameData.jugadorLocal.id, id_jugador_recibe_ataque, r, c)

                return this.enviarMensajeSocket(msg);

            },
            enviarMensajeResultadoDeAtaque(rZona, cZona, isSubmarino) {

                let msg = factoryMensajeSocket.ResultadoAtaque(gameData.jugadorLocal.id, rZona, cZona, isSubmarino);

                return this.enviarMensajeSocket(msg);

            }
        },
        computed: {},
        mounted() {

            this.newRoom.token = (Math.random().toString(36).substring(2, 5) + Math.random().toString(36).substring(2, 5)).toUpperCase();
            console.log('vue ready');
        }
    }
);


/********************************************************************************/
/********************************************************************************/

var ws = new WebSocket("wss://9ig8cfud1d.execute-api.us-west-2.amazonaws.com/Dev");

ws.onopen = function (evento) {
    appController.recibirOnOpen(evento);
};

ws.onclose = function (evento) {
    appController.recibirOnClose(evento);
};

ws.onmessage = function (evento) {
    appController.recibirOnMesagge(evento);
};

ws.onerror = function (evento) {
    appController.recibirOnError(evento);
};

