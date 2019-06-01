export class ResultadoOpe{

    constructor(isOk, msg, dataAdicional) {

        this.getIsSuccess= function(){
            return isOk;
        };

        this.getMsg= function(){
            return msg;
        };

        this.getData = function () {
            return dataAdicional;
        }

    }

}

export  let FactoryResultadoOpe= {
    OK : function(data = null){
        return new ResultadoOpe(true,msg,data);
    },
    Error : function (msg, data=null) {
        return new ResultadoOpe(false,msg,data);
    }

};