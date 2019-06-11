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
            listaComandos: [
                {tipo: 'solicitar_crear_room'},
                {tipo: 'solicitar_ingresar_room'},
                {tipo: 'confirmar_ingresa'},
                {tipo: 'sale'},
                {tipo: 'confirma_posiciones'},
                {tipo: 'inicia_batalla'},
                {tipo: 'lanza_cohete'},
                {tipo: 'resultado_ataque'}
            ],
            dataMsg: {},
            newRoom: {
                codigo: null,
                numJugadores: null
            },
            unirseRoom: null,
            numJugadoresEsperados: null,
            listaNumJugadores: [2, 3, 4, 5, 6, 7, 8, 9]
        },
        methods: {
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
                gameData.numJugadoresEsperados=this.newRoom.numJugadores;

                this.listaInvitacionAJuego = [];
                this.numJugadoresEsperados = this.newRoom.numJugadores;


                //Paso 2 mandar invitacion a jugadores y esperar ingreso
                let data = {
                    type: 'message',
                    code: this.newRoom.codigo,
                    tipo: 'invitacion',
                    numJugadoresEsperados: this.newRoom.numJugadores,
                    idJugador: gameData.jugadorLocal.id
                };

                this.listaMsgEnviado.push(data);
                ws.send(JSON.stringify(data));

                //esperamos el juego
                //document.getElementById('container').style='block';
                this.etapa = 'juego';
                gameData.canvas.style.backgroundColor='darkslategray';


            },
            empezarPartidaUnirse(invitacion) {

                //Paso 1 creamos el juego (se crea el id de jugador)
                gameController.onRegistroSocket(invitacion.codigo, invitacion.numJugadoresEsperados);

                this.numJugadoresEsperados = invitacion.numJugadores;

                //registrar al jugador que creo la invitacion
                let msg = {
                    id_jugador: invitacion.idJugadorCreador,
                    token: invitacion.codigo
                };

                let jugadorMaster = factoryJugadorRemoto.fromMsgJugadorIngresa(msg);
                gameData.listaJugadores.push(jugadorMaster);

                //esperamos el juego
                this.etapa = 'juego';
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

                this.listaMsgRecibido.unshift(
                    {
                        id: this.getNextIdentity(),
                        data: data,
                        eventoTipo: tipo
                    }
                );

                //Ya tenemos un evento del socket que es parte del juego
                if (data.tipo === 'invitacion') {
                    this.listaInvitacionAJuego.push({
                        codigo: data.code,
                        numJugadoresEsperados: data.numJugadoresEsperados,
                        idJugadorCreador: data.idJugador
                    });
                }
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

                let msg = {
                    data: data,
                    type: "message"
                };

                ws.send(JSON.stringify(msg));

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

function enviarMensajeSocket(data) {


}