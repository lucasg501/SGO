const ParcelaModel = require("../model/parcelaModel");

class ParcelaController {

    async gravar(req, res) {

        try {
            if (req.body.parcelas.length > 0) {
                
                let i = 0;
                let ok = true;

                while (ok && i < req.body.parcelas.length) {
                    
                    let parcela = req.body.parcelas[i];
                    let parcelaModel = new ParcelaModel(parcela.idParcela, parcela.dataVencimento, parcela.dataRecebimento, 
                    parcela.valorParcela, parcela.idObra);
                    
                    ok = await parcelaModel.gravar();
                    i++;
                }

                if (ok) {
                    res.status(200).json({msg: "Parcelas gravadas com sucesso!"});
                }
                else {
                    res.status(500).json({msg: "Erro na gravação de parcelas!"});
                }
            }
            else {
                res.status(400).json({msg: "Parâmetros inválidos!"});
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