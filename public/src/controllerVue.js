const appController = new Vue({
        el: '#app',
        data: {
            isDebug: true,
            estadoConexion: false,
            etapa: 'inicio',
            subEtapa: 0,
            identityContador: 0,
            listaMsgRecibido: [],
            listaMsgEnviado: [],
            listaInvitacionAJuego: [],
            listaTipoMsg: [
                {tipo: 'invitacion_aceptada'},
                {tipo: tipoMsgSocket.confirma_posiciones},
                {tipo: tipoMsgSocket.lanza_cohete},
                {tipo: tipoMsgSocket.resultado_ataque}
            ],
            dataMsg: {},
            newRoom: {
                codigo: null,
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


                //Paso 1 creamos el juego (se crea el id de jugador)
                gameController.onRegistroSocket(this.newRoom.codigo, this.newRoom.numJugadores);
                gameData.numJugadoresEsperados = this.newRoom.numJugadores;

                this.setLabelIdPlayer(gameData.jugadorLocal.id);

                this.listaInvitacionAJuego = [];
                this.numJugadoresEsperados = this.newRoom.numJugadores;


                //Paso 2 mandar invitacion a jugadores y esperar ingreso
                let msgInvitacion = {                  
                    code: this.newRoom.codigo,
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
                gameController.onRegistroSocket(invitacion.codigo, invitacion.numJugadoresEsperados);

                this.numJugadoresEsperados = invitacion.numJugadoresEsperados;
                this.setLabelIdPlayer(gameData.jugadorLocal.id);

                //Paso 2registrar al jugador que creo la invitacion

                let jugadorMaster = factoryJugadorRemoto.fromMsgJugadorIngresa({
                    id_jugador: invitacion.idJugadorCreador,
                    token: invitacion.codigo
                });
                gameData.listaJugadores.push(jugadorMaster);


                //Paso 3 - enviamos acepotacion para que el jugador que creo el juego nos agregue
                let msgAceptacion = {                   
                    token: invitacion.codigo,
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
                    console.log(evento);
                    return;
                }

                if (typeof evento.data !== "string") {
                    console.log('este esperamos que el data sea string -json ');
                    console.log(evento.data);
                    return;
                }

                //ya es seguro tener el data
                let data = JSON.parse(evento.data);

                //Como filtro solo vamos a mostrar los mensajes que son de este gameToken

                if (this.etapa === 'juego' && data.token !== gameData.tokenRoom) {
                    console.log('se recibio un mensaje que no es de esta partida - no se agrega');
                    return;
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
                        codigo: data.code,
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

                    //estamos en el caso cuando un jugador local invito a jugadores y aceptaron
                    if (gameData.listaJugadores.length < this.numJugadoresEsperados - 1) {

                        //si faltan jugadores los agrtegamos
                        let jugadorMaster = factoryJugadorRemoto.fromMsgJugadorIngresa({
                            id_jugador: data.id_jugador,
                            token: data.code
                        });
                        gameData.listaJugadores.push(jugadorMaster);
                    }

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
                return this.onEventoSocket(evento, 'recibirOnError');
            },
            enviarMensajeSocket(data) {

                data.type = 'message';
                ws.send(JSON.stringify(data));

                this.listaMsgEnviado.push(data);
            }
        },
        computed: {},
        mounted() {

            this.newRoom.codigo = (Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10)).toUpperCase();
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

