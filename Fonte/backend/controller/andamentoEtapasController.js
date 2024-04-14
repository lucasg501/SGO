const AndamentoEtapasModel = require("../model/andamentoEtapasModel");

class AndamentoEtapasController {

    async gravar(req, res) {

        try {
            if (req.body.etapas.length > 0) {

                let ok = true;

                while (ok && i < req.body.etapas.length) {

                    let etapa = req.body.etapas[i];
                    let andamentoEtapasModel = new AndamentoEtapasModel();

                    if (etapa.idObra > 0 && etapa.idEtapa > 0 && etapa.dataPrevInicio != undefined && 
                    etapa.dataPrevFim != undefined && andamentoEtapasModel.descricaoEtapa != "") {

                        andamentoEtapasModel.idObra = etapa.idObra;
                        andamentoEtapasModel.idEtapa = etapa.idEtapa;
                        andamentoEtapasModel.dataPrevInicio = etapa.dataPrevInicio;
                        andamentoEtapasModel.dataPrevFim = etapa.dataPrevFim;
                        andamentoEtapasModel.dataFim = etapa.dataFim;
                        andamentoEtapasModel.descricaoEtapa = etapa.descricaoEtapa;

                        ok = await andamentoEtapasModel.gravar();
                    }

                    i++;
                }

                if (ok) {
                    res.status(200).json({msg: "Etapas gravadas com sucesso!"});
                }
                else {
                    res.status(500).json({msg: "Erro gravar as etapas!"});
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
}

module.exports = AndamentoEtapasController;