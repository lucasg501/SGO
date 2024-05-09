const { response } = require('express');
const ObrasModel = require('../model/obraModel.js');

class ObrasController {
    gravar(req,res){

        try {

            if(Object.keys(req.body).length > 0){
                let obrasModel = new ObrasModel();
            
                obrasModel.idObra = 0;
                obrasModel.endereco = req.body.endereco;
                obrasModel.bairro = req.body.bairro;
                obrasModel.cidade = req.body.cidade;
                obrasModel.valorTotal = req.body.valorTotal;
                obrasModel.dataInicio = req.body.dataInicio;
                obrasModel.dataTermino = req.body.dataTermino;
                obrasModel.contrato = req.body.contrato;
                obrasModel.planta = req.body.planta;
                obrasModel.idCliente = req.body.idCliente;
                obrasModel.cepObra = req.body.cepObra;
                obrasModel.terminada = req.body.terminada;
                let ok = obrasModel.gravar();
                if(ok){
                    res.status(200).json({msg:"Obra gravada com sucesso!"});
                }else{
                    res.status(500).json({msg:"Erro ao gravar obra!"});
                }
            }else{
                res.status(400).json({msg:"Parâmetros inválidos!"});
            }
        }
        catch(ex) {
            res.status(500).json({msg: ex.message});
        }
    }

    async alterar(req,res){

        try {
            if(Object.keys(req.body).length > 0){
                let obrasModel = new ObrasModel();
            
                obrasModel.idObra = req.body.idObra;
                obrasModel.endereco = req.body.endereco;
                obrasModel.bairro = req.body.bairro;
                obrasModel.cidade = req.body.cidade;
                obrasModel.valorTotal = req.body.valorTotal;
                obrasModel.dataInicio = req.body.dataInicio;
                obrasModel.dataTermino = req.body.dataTermino;
                obrasModel.contrato = req.body.contrato;
                obrasModel.planta = req.body.planta;
                obrasModel.idCliente = req.body.idCliente;
                obrasModel.cepObra = req.body.cepObra;
                obrasModel.terminada = req.body.terminada;
                let ok = obrasModel.gravar();
                if(ok){
                    res.status(200).json({msg:"Obra alterada com sucesso!"});
                }else{
                    res.status(500).json({msg:"Erro ao alterar obra!"});
                }
            }else{
                res.status(400).json({msg:"Parâmetros inválidos!"});
            }
        }
        catch(ex) {
            res.status(500).json({msg: ex.message});
        }
    }

    async listar(req,res){
        
        try {
            let obrasModel = new ObrasModel();
            let lista = await obrasModel.listar();
            let listaRetorno = [];
            for (let i = 0; i < lista.length; i++) {
                listaRetorno.push(lista[i].toJSON());
            }
            res.status(200).json(listaRetorno);
        }
        catch(ex) {
            res.status(500).json({msg: ex.message});
        }
    }

    async excluir(req,res){
        try{
            if(req.params.idObra != null){
                let obrasModel = new ObrasModel();
                let ok = await obrasModel.excluir(req.params.idObra);
                if(ok){
                    res.status(200).json({msg:"Obra excluída com sucesso!"});
                }else{
                    res.status(500).json({msg:"Erro ao excluir obra! Apague primeiro os dados relacionados a esta obra. Serviços, Parcelas!"});
                }
            }else{
                res.status(400).json({msg:"Parâmetros inválidos!"});
            }
        }catch(e){
            res.status(500).json({msg:e.message});
        }
    }

    async obter(req,res){
        if(req.params.idObra != undefined){
            let obrasModel = new ObrasModel();
            obrasModel = await obrasModel.obter(req.params.idObra);
            if(obrasModel == null){
                res.status(400).json({msg:"Obra não encontrada!"});
            }else{
                res.status(200).json(obrasModel.toJSON());
            }
        }else{
            res.status(400).json({msg:"Parâmetros inválidos!"});
        }
    }
}

module.exports = ObrasController;