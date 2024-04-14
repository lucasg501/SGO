const ParceiroModel = require("../model/parceiroModel");

class ParceiroController {

    async gravar(req, res) {

        try {
            if (req.body.nomeParceiro != "" && req.body.telParceiro != "" && req.body.idAreaAtuacao != undefined) {

                let parceiroModel = new ParceiroModel(0, req.body.nomeParceiro, req.body.telParceiro, req.body.idAreaAtuacao);
                let ok = await parceiroModel.gravar();

                if (ok) {
                    res.status(200).json({msg: "Parceiro cadastrado com sucesso!"});
                }
                else {
                    res.status(500).json({msg: "Erro ao cadastrar o parceiro!"});
                }
            }
            else {
                res.status(400).json({msg: "Parâmetros inválidos!"});
            }
        }
        catch(e) {
            res.status(500).json({msg: e.message});
        }
    }

    async alterar(req, res) {

        try {
            if (Object.keys(req.body).length == 4) {

                let parceiroModel = new ParceiroModel(req.body.idParceiro, req.body.nomeParceiro, req.body.telParceiro, req.body.idAreaAtuacao);
                let ok = await parceiroModel.gravar();

                if (ok) {
                    res.status(200).json({msg: "Parceiro alterado com sucesso!"});
                }
                else {
                    res.status(500).json({msg: "Erro ao alterar o parceiro!"});
                }
            }
            else {
                res.status(400).json({msg: "Parâmetros inválidos!"});
            }
        }
        catch(e) {
            res.status(500).json({msg: e.message});
        }
    }

    async listar(req, res) {

        try {
            let parceiroModel = new ParceiroModel();
            let lista = await parceiroModel.listar();
            let listaRetorno = [];

            for (let i = 0; i < lista.length; i++) {
                listaRetorno.push(lista[i].toJSON());
            }

            res.status(200).json(listaRetorno);
        }
        catch(e) {
            res.status(500).json({msg: e.message});
        }
    }

    async obter(req, res) {
        
        try {
            if (req.params.idParceiro != undefined) {

                let parceiroModel = new ParceiroModel();
                parceiroModel = await parceiroModel.obter(req.params.idParceiro);

                if (parceiroModel == null) {
                    res.status(400).json({msg: "Parceiro não encontrado!"});
                }
                else {
                    res.status(200).json(parceiroModel.toJSON());
                }
            }
            else {
                res.status(400).json({msg: "Parâmetros inválidos"});
            }
        }
        catch(e) {
            res.status(500).json({msg: e.message});
        }
    }

    async obterParceirosArea(req,res){
        try{
            if(req.params.idAreaAtuacao != undefined){

                let parceiroModel = new ParceiroModel();
                let lista = await parceiroModel.obterParceirosArea(req.params.idAreaAtuacao);

                if (lista.length > 0) {

                    let listaJson = [];

                    for (let i = 0; i < lista.length; i++) {
                        listaJson.push(lista[i].toJSON());
                    }

                    res.status(200).json(listaJson);
                }
                else {
                    res.status(400).json({msg:"Parceiros não encontrados!"});
                }
            }else{
                res.status(400).json({msg:"Parâmetros inválidos"});
            }
        }catch(e){
            res.status(500).json({msg:e.message});
        }
    }

    async excluir(req, res) {

        try {
            if (req.params.idParceiro != null) {
                let parceiroModel = new ParceiroModel();
                let ok = await parceiroModel.excluir(req.params.idParceiro);

                if (ok) {
                    res.status(200).json({msg: "Parceiro excluído com sucesso!"});
                }
                else {
                    res.status(500).json({msg: "Erro ao excluir o parceiro!"});
                }
            }
            else {
                res.status(400).json({msg: "Parâmetros inválidos!"});
            }
        }
        catch(e) {
            res.status(500).json({msg: e.message});
        }
    }
}

module.exports = ParceiroController;