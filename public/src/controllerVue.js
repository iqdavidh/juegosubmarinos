const app = new Vue({
    el: '#app',
    data: {
        isDebug: false,
        etapa:'inicio',
        subEtapa:0,
        idJugador: null,
        identityContador: 0,
        lastMsgRecibido: "",
        listaMsgRecibido: [],
        listaMsgEnviado: [],
        dataMsg: {
            tokenRoom: '*token*',
            id_jugador_recibe_ataque: 'x',
            r: 1,
            c: 1
        },
        listaComandos: [
            {tipo: 'solicitar_crear_room'},
            {tipo: 'solicitar_ingresar_room'},
            {tipo: 'confirmar_ingresa'},
            {tipo: 'sale'},
            {tipo: 'confirma_posiciones'},
            {tipo: 'inicia_batalla'},
            {tipo: 'lanza_cohete'},
            {tipo: 'resultado_ataque'}
        ]
    },
    methods: {
        getIdJugador() {
            return 'player-' + Math.round(Math.random() * 10000000).toString();
        },
        getNextIdentity() {
            this.identityContador++;
            return this.identityContador;
        },
        onEventoSocket(evento, tipo) {

            if (evento.data === undefined || null) {
                console.log('este es un evento que no data');
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
                    data,
                    eventoTipo: tipo,
                }
            );
        },
        recibirOnOpen(evento) {
            return this.onEventoSocket(evento, 'onRecibirMensaje');
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
        sendMessage(itemComando) {
            /* verficiar que este conectado ws*/

            let data = {
                modo: 'juego',
                token: this.dataMsg.tokenRoom,
                id_jugador: this.idJugador,
                tipo: itemComando.tipo
            };


            if (itemComando.tipo === 'lanza_cohete') {
                data.id_jugador_recibe_ataque = this.dataMsg.id_jugador_recibe_ataque;
                data.r = this.dataMsg.r;
                data.c = this.dataMsg.c;
            }

            if (itemComando.tipo === 'resultado_ataque') {
                data.r = this.dataMsg.r;
                data.c = this.dataMsg.c;
                data.isSubmarino = (Math.random() > 0.5);
            }

            data.type = "message";

            this.listaMsgEnviado.push(data);

            ws.send(JSON.stringify(data));
        }
    },
    computed: {},
    mounted() {
        this.idJugador = this.getIdJugador();
        console.log('vue ready');
    }
});


/********************************************************************************/
/********************************************************************************/

var ws = new WebSocket("wss://9ig8cfud1d.execute-api.us-west-2.amazonaws.com/Dev");

ws.onopen = function (evento) {
    app.recibirOnOpen(evento);
};

ws.onclose = function (evento) {
    app.recibirOnClose(evento);
};

ws.onmessage = function (evento) {
    app.recibirOnMesagge(evento);
};

ws.onerror = function (evento) {
    app.recibirOnError(evento);
};