const FuncionarioModel = require("../model/funcionarioModel");

class FuncionarioController {

    async gravar(req, res) {

        try {
            if (Object.keys(req.body).length == 3) {

                let funcModel = new FuncionarioModel(0, req.body.nomeFuncionario, req.body.telFuncionario, req.body.cargoFuncionario);

                let ok = await funcModel.gravar();

                if (ok) {
                    res.status(200).json({msg: "Funcionário cadastrado com sucesso!"});
                }
                else {
                    res.status(500).json({msg: "Erro ao cadastrar o funcionário!"});
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
            if (Object.keys(req.body).length == 3) {

                let funcModel = new FuncionarioModel(req.body.idFuncionario, 
                    req.body.nomeFuncionario, req.body.telFuncionario, req.body.cargoFuncionario);

                let ok = await funcModel.gravar();

                if (ok) {
                    res.status(200).json({msg: "Funcionário alterado com sucesso!"});
                }
                else {
                    res.status(500).json({msg: "Erro ao alterar o funcionário!"});
                }
            }
            else {
                res.status(400).json({msg: "Parâmetros inválidos!"});
            }
        }
        catch(e) {
            res.status(500).json({msg: e.message})
        }
    }

    async listar(req, res) {

        try {
            let funcModel = new FuncionarioModel();
            let lista = await funcModel.listar();
            let listaRetorno = [];

            for (let i = 0; i < lista.length; i++) {
                listaRetorno.push(lista[i].toJSON());
            }

            res.status(200).json(listaRetorno);
        }
        catch(e) {
            res.status(500).json({msg: e.message})
        }
    }

    async excluir(req, res) {

        try {
            let funcModel = new FuncionarioModel();
            let ok = await funcModel.excluir(req.params.idFuncionario);

            if (ok) {
                res.status(200).json({msg: "Funcionário excluído com sucesso!"});
            }
            else {
                res.status(500).json({msg: "Erro ao excluir o funcionário!"});
            }
        }
        catch(e) {
            res.status(500).json({msg: e.message});
        }
    }
}

module.exports = FuncionarioController;