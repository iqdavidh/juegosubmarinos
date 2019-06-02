class GameEngineDataIni {
    constructor() {
        this.size = null;
        this.listaJugador=[];
    }

    setSize(size){
        this.size=size;
    }

    addJugador(jugador){
        this.listaJugador.push(jugador);
    }

    getResOpeIsValid(){
        let isValid= true;
        let listaMsg=[];

        if(this.size===null){
            isValid=false;
            listaMsg.push('Size es null');
        }

        if(this.listaJugador.length<2){
            isValid=false;
            listaMsg.push('No hay jugadores suficientes');
        }

        if (isValid){
            return FactoryResultadoOpe.OK();
        }else{
            return FactoryResultadoOpe.Error('Error de validacion', listaMsg);
        }
    }


}