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

    async obter(req,res){
        if(req.params.idAreaAtuacao != undefined){
            let areaAtuacaoModel = new AreaAtuacaoModel();
            areaAtuacaoModel = await areaAtuacaoModel.obter(req.params.idAreaAtuacao);
            if(areaAtuacaoModel == null){
                res.status(400).json({msg:"Area de atuação não encontrada!"});
            }else{
                res.status(200).json(areaAtuacaoModel.toJSON());
            }
        }else{
            res.status(400).json({msg:"Parâmetros inválidos"});
        }
    }
}

module.exports = AreaAtuacaoController;