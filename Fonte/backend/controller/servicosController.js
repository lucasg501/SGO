const ServicosModel = require('../model/servicosModel.js');

class ServicosController{
    async gravar(req,res){
        if(Object.keys(req.body).length > 0){
            let servicosModel = new ServicosModel();

            servicosModel.idServico = 0;
            servicosModel.descServico = req.body.descServico;
            servicosModel.valorServico = req.body.valorServico;
            servicosModel.idObra = req.body.idObra;
            servicosModel.idParceiro = req.body.idParceiro;
            let ok = await servicosModel.gravar();
            if(ok){
                res.status(200).json({msg:"Serviço gravado com sucesso!"});
            }else{
                res.status(500).json({msg:"Erro ao gravar o serviço!"});
            }
        }else{
            res.status(400).json({msg:"Parâmetros inválidos!"});
        }
    }

    async alterar(req,res){
        if(Object.keys(req.body).length > 0){
            let servicosModel = new ServicosModel();

            servicosModel.idServico = req.body.idServico;
            servicosModel.descServico = req.body.descServico;
            servicosModel.valorServico = req.body.valorServico;
            servicosModel.idObra = req.body.idObra;
            servicosModel.idParceiro = req.body.idParceiro;
            let ok = await servicosModel.gravar();
            if(ok){
                res.status(200).json({msg:"Serviço alterado com sucesso!"});
            }else{
                res.status(500).json({msg:"Erro ao alterar o serviço!"});
            }
        }else{
            res.status(400).json({msg:"Parâmetros inválidos!"});
        }
    }

    async listar(req,res){
        let servicosModel = new ServicosModel();
        let lista = await servicosModel.listar();
        let listaRetorno = []

        for(let i=0; i<lista.length; i++){
            listaRetorno.push(lista[i].toJSON());
        }
        res.status(200).json(listaRetorno);
    }

    async obter(req,res){
        if(req.params.idServico != undefined){
            let servicosModel = new ServicosModel();
            servicosModel = await servicosModel.obter(req.params.idServico);
            if(servicosModel == null){
                res.status(404).json({msg:"Serviço não encontrado!"});
            }else{
                res.status(200).json(servicosModel.toJSON());
            }
        }else{
            res.status(400).json({msg:"Parâmetros inválidos!"});
        }
    }

    async excluir(req,res){
        try{
            if(idServico != null){
                let servicosModel = new ServicosModel();
                let ok = await servicosModel.excluir(req.params.idServico);
                if(ok){
                    res.status(200).json({msg:"Serviço excluído com sucesso!"});
                }else{
                    res.status(500).json({msg:"Erro ao excluir o serviço!"});
                }
            }else{
                res.status(400).json({msg:"Parâmetros inválidos!"});
            }
        }catch(e){
            res.status(500).json({msg:e.message});
        }
    }
}

module.exports = ServicosController;