const ParcelaModel = require("../model/parcelaModel");

class ParcelaController {

    async gravar(req, res) {

        try {
            if (req.body.length > 0) {
                
                const promises = [];

                for (const parcela of req.body) {

                    const {
                        dataVencimento,
                        dataRecebimento,
                        valorParcela,
                        idObra
                    } = parcela;

                    const novaParcela = new ParcelaModel(0, dataVencimento, dataRecebimento, valorParcela, idObra);

                    promises.push(novaParcela.gravar());
                }

                let ok = await Promise.all(promises);
                
                if (ok){
                    res.status(200).json({msg: "Parcelas gravadas com sucesso!"});
                }
                else {
                    res.status(500).json({msg: "Erro na gravação de parcelas!"});
                }
            }
            else {
                res.status(400).json({msg: "Nenhum dado recebido ou formato inválido!"});
            }
        }
        catch(ex) {
            res.status(500).json({msg: ex.message});
        }
    }

    async obterParcelasPorObra(req, res) {

        try {
            if (req.params.idObra != undefined) {

                let parcelaModel = new ParcelaModel();
                let lista = await parcelaModel.obterParcelasPorObra(req.params.idObra);

                if (lista.length > 0) {

                    let listaJson = [];

                    for (let i = 0; i < lista.length; i++) {
                        listaJson.push(lista[i].toJSON());
                    }

                    res.status(200).json({listaJson});
                }
                else {
                    res.status(404).json({msg: "Obra não encontrada!"});
                }
            }
        }
        catch(ex) {
            res.status(500).json({msg: ex.message});
        }
    }

    async listar(req, res) {

        try {
            let parcelaModel = new ParcelaModel();
            let lista = await parcelaModel.listar();
            let listaJson = [];

            for (let i = 0; i < lista.length; i++) {
                listaJson.push(lista[i].toJSON());
            }

            res.status(200).json(listaJson);
        }
        catch(ex) {
            res.status(500).json({msg: message});
        }
    }

    async obter(req, res) {
            if (req.params.numParcela != undefined) {
                let parcelaModel = new ParcelaModel();
                parcelaModel = await parcelaModel.obter(req.params.numParcela);

                if (parcelaModel == null) {
                    res.status(404).json({msg: "Parcela não encontrada!"});
                }
                else {
                    res.status(200).json(parcelaModel.toJSON());
                }
            }else{
                res.status(400).json({msg: "Parâmetros inválidos!"});
            }
        }

    async alterar(req,res){
        if(Object.keys(req.body).length > 0){
            let parcelaModel = new ParcelaModel();

            parcelaModel.numParcela = req.body.numParcela;
            parcelaModel.dataVencimento = req.body.dataVencimento;
            parcelaModel.dataRecebimento = req.body.dataRecebimento;
            parcelaModel.valorParcela = req.body.valorParcela;
            parcelaModel.idObra = req.body.idObra;
            let ok = await parcelaModel.gravar();
            if(ok){
                res.status(200).json({msg: "Parcela alterada com sucesso!"});
            }else{
                res.status(500).json({msg: "Erro ao alterar a parcela!"});
            }
        }else{
            res.status(400).json({msg: "Nenhum dado recebido ou formato inválido!"});
        }
    }
}

module.exports = ParcelaController;