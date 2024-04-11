const EtapaModel = require('../model/etapaModel.js');

class EtapaController {
    
    async listar(req,res){
        let etapaModel = new EtapaModel();
        let lista = await etapaModel.listar();
        let listaRetorno = [];
        for(let i=0; i<lista.length; i++){
            listaRetorno.push(lista[i].toJSON());
        }
        res.status(200).json(listaRetorno);
    }

}

module.exports = EtapaController;