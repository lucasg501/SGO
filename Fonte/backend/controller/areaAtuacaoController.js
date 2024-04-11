const AreaAtuacaoModel = require('../model/areaAtuacaoModel.js');

class AreaAtuacaoController{
    async listar(req,res){
        let areaAtuacaoModel = new AreaAtuacaoModel();
        let lista = await areaAtuacaoModel.listar();
        let listaRetorno = [];
        for(let i=0; i<lista.length; i++){
            listaRetorno.push(lista[i].toJSON());
        }
        res.status(200).json(listaRetorno);
    }
}

module.exports = AreaAtuacaoController;