const DiariaModel = require("../model/diariaModel");

class DiariaController {

    async gravar(req, res) {

        try {

            if (req.body.length > 0) {

                let idFuncionarioExclusao = req.body[0].idFunc;

                let diariaModel = new DiariaModel();
                await diariaModel.excluirDiariasFuncionario(idFuncionarioExclusao);

                let diarias = req.body;
                
                const promises = [];

                for (const diaria of diarias) {

                    const {
                        dia,
                        valorDiaria,
                        dataPgto,
                        idFunc
                    } = diaria;

                    const novaDiaria = new DiariaModel(0, dia, valorDiaria, dataPgto, idFunc);

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
            else {
                res.status(400).json({msg: "Parâmetros inválidos!"});
            }
        }
        catch(ex) {
            res.status(500).json({msg: ex.message});
        }
    }

    async obter(req, res) {

        try {

            if (req.params.idDiaria != undefined) {

                let diariaModel = new DiariaModel();
                diariaModel = await diariaModel.obter(req.params.idDiaria);

                if (diariaModel != null) {
                    res.status(200).json(diariaModel.toJSON());
                }
                else {
                    res.status(404).json({msg: "Diária não encontrada!"});
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

    async alterar(req, res) {

        try {

            if (Object.keys(req.body).length > 0) {

                let diariaModel = new DiariaModel();

                diariaModel.idDiaria = req.body.idDiaria;
                diariaModel.dia = req.body.dia;
                diariaModel.valorDiaria = req.body.valorDiaria;
                diariaModel.dataPgto = req.body.dataPgto;
                diariaModel.idFuncionario = req.body.idFuncionario;

                let ok = await diariaModel.gravar();

                if (ok) {
                    res.status(200).json({msg: "Diária marcada como paga com sucesso!"});
                }
                else {
                    res.status(500).json({msg: "Erro ao marcar pagamento da diária!"});
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

    async obterDiariasFuncionario(req, res) {

        try {
            
            if (req.params.idFuncionario != undefined) {

                let diariaModel = new DiariaModel();
                let lista = await diariaModel.obterDiariasFuncionario(req.params.idFuncionario);

                let listaJson = [];

                for (let i = 0; i < lista.length; i++) {
                    listaJson.push(lista[i].toJSON());
                }

                res.status(200).json(listaJson);
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
                let ok = await diariaModel.excluirDiariasFuncionario(req.params.idFuncionario);

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

    async cancelarPagamento(req, res) {

        try {

            if (req.params.idDiaria != undefined) {

                let diariaModel = new DiariaModel();
                
                let ok = await diariaModel.cancelarPagamento(req.params.idDiaria);

                if (ok) {
                    res.status(200).json({msg: "Pagamento cancelado!"});
                }
                else {
                    res.status(500).json({msg: "Erro no cancelamento deste pagamento!"});
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