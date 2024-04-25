const DiariaModel = require("../model/diariaModel");

class DiariaController {

    async gravar(req, res) {

        try {

            if (req.body.length > 0) {

                let diarias = req.body;
                
                const promises = [];

                for (const diaria of diarias) {

                    const {
                        dia,
                        valorDiaria,
                        dataPgto,
                        idFuncionario
                    } = diaria;

                    const novaDiaria = new DiariaModel(0, dia, valorDiaria, dataPgto, idFuncionario);

                    promises.push(novaDiaria.gravar());
                }

                let ok = await Promise.all(promises);

                if (ok) {
                    res.status(200).json({msg: "Diarias gravadas com sucesso!"});
                }
                else {
                    res.status(500).json({msg: "Erro na gravação de diárias!"});
                }
            }
        }
        catch(ex) {
            res.status(500).json({msg: ex.message});
        }
    }

    async obterDiariasFuncionario(req, res) {

        try {
            
            if (req.params.idFuncionario != undefined) {

                let diariaModel = new DiariaModel();
                let lista = await diariaModel.obterDiariasFuncionario(req.params.idFuncionario);

                let listaJson = [];

                for (let i = 0; i < lista.length; i++) {
                    listaJson.push(lista[i].toJSON());
                }

                res.status(200).json({listaJson});
            }
            else {
                res.status(400).json({msg: "Parâmetros inválidos!"});
            }

        }
        catch(ex) {
            res.status(500).json({msg: ex.message});
        }
    }

    async excluirDiariasFuncionario(req, res) {

        try {
            if (req.params.idFuncionario != undefined) {
                
                let diariaModel = new DiariaModel();
                let ok = await diariaModel.excluirDiariasFuncionario(idFuncionario);

                if (ok) {
                    res.status(200).json({msg: "Diárias do funcionário " + idFuncionario + " excluídas com sucesso!"});
                }
                else {
                    res.status(500).json({msg: "Erro na exclusão das diárias do funcionário " + idFuncionario + "!"});
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

module.exports = DiariaController;