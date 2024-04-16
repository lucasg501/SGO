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

                Promise.all(promises)
                .then(() => {
                    res.status(200).json({msg: "Parcelas gravadas com sucesso!"});
                })
                .catch(() => {
                    res.status(500).json({msg: "Erro na gravação de parcelas!"});
                })
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
}

module.exports = ParcelaController;