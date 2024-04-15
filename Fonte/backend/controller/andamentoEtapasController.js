const AndamentoEtapasModel = require("../model/andamentoEtapasModel");

class AndamentoEtapasController {

    async gravar(req, res) {
        if(Object.keys(req.body).length > 0){
            let andamentoEtapasModel = new AndamentoEtapasModel();

            andamentoEtapasModel.idObra = req.body.idObra;
            andamentoEtapasModel.idEtapa = req.body.idEtapa;
            andamentoEtapasModel.dataPrevInicio = req.body.dataPrevInicio;
            andamentoEtapasModel.dataPrevTermino = req.body.dataPrevTermino;
            andamentoEtapasModel.dataFim = req.body.dataFim;
            andamentoEtapasModel.descricaoEtapa = req.body.descricaoEtapa;
            andamentoEtapasModel.idAndamento = 0;
            let ok = await andamentoEtapasModel.gravar();
            if(ok){
                res.status(200).json({msg:"Andamento da etapa gravado com sucesso!"});
            }else{
                res.status(500).json({msg:"Erro ao gravar o andamento da etapa!"});
            }
        }else{
            res.status(400).json({msg:"Parâmetros inválidos!"});
        }
    }

    async obterEtapasPorObra(req, res) {

        try {
            if (req.params.idObra != undefined) {
                let andamentoEtapasModel = new AndamentoEtapasModel();
                let lista = await andamentoEtapasModel.obterEtapasPorObra(req.params.idObra);

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
            else {
                res.status(400).json({msg: "Parâmetros inválidos!"});
            }
        }
        catch(ex) {
            res.status(500).json({msg: ex.message});
        }
    }

    async listar(req,res){
        let andamentoEtapasModel = new AndamentoEtapasModel();
        let lista = await andamentoEtapasModel.listar();
        let listaRetorno = [];
        for(let i=0; i<lista.length; i++){
            listaRetorno.push(lista[i].toJSON());
        }
        res.status(200).json(listaRetorno);
    }
}

module.exports = AndamentoEtapasController;