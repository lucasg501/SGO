const AndamentoEtapasModel = require("../model/andamentoEtapasModel");

class AndamentoEtapasController {

    async gravar(req, res) {
        if (req.body.length > 0) { // Verifica se o corpo da requisição é um array
            const andamentoEtapasModel = new AndamentoEtapasModel();
            const promises = [];

            // Itera sobre o array de etapas recebido
            for (const etapa of req.body) {
                const {
                    idObra,
                    idEtapa,
                    dataPrevInicio,
                    dataPrevTermino,
                    dataFim,
                    descricaoEtapa
                } = etapa;

                // Cria uma nova instância do modelo para cada etapa
                const novaEtapa = new AndamentoEtapasModel(
                    idObra,
                    idEtapa,
                    dataPrevInicio,
                    dataPrevTermino,
                    dataFim,
                    descricaoEtapa,
                    0 // idAndamento
                );
                

                // Chama o método gravar do modelo e armazena a promise resultante
                promises.push(novaEtapa.gravar());
            }

            // Aguarda todas as operações de gravação serem concluídas
            Promise.all(promises)
                .then(() => {
                    res.status(200).json({ msg: "Andamentos das etapas gravados com sucesso!" });
                })
                .catch(() => {
                    res.status(500).json({ msg: "Erro ao gravar os andamentos das etapas!" });
                });
        } else {
            res.status(400).json({ msg: "Nenhum dado recebido ou formato inválido!" });
        }
    }


    async obterEtapasPorObra(req, res) {
        if(req.params.idObra != null){
            let andamentoEtapasModel = new AndamentoEtapasModel();
            andamentoEtapasModel = await andamentoEtapasModel.obterEtapasPorObra(req.params.idObra);
            let listaRetorno = [];
            for(let i=0; i<andamentoEtapasModel.length; i++){
                listaRetorno.push(andamentoEtapasModel[i].toJSON());
            }
            res.status(200).json(listaRetorno);
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

    async obter(req,res){
        if(req.params.idAndamento != undefined){
            let andamentoEtapasModel = new AndamentoEtapasModel();
            andamentoEtapasModel = await andamentoEtapasModel.obter(req.params.idAndamento);
            if(andamentoEtapasModel == null){
                res.status(404).json({msg: "Andamento não encontrado!"});
            }else{
                res.status(200).json(andamentoEtapasModel.toJSON());
            }
        }else{
            res.status(400).json({msg: "Parâmetros inválidos!"});
        }
    }

    async alterar(req,res){
        if(Object.keys(req.body).length > 0){
            let andamentoEtapasModel = new AndamentoEtapasModel();

            andamentoEtapasModel.idAndamento = req.body.idAndamento;
            andamentoEtapasModel.idObra = req.body.idObra;
            andamentoEtapasModel.idEtapa = req.body.idEtapa;
            andamentoEtapasModel.dataPrevInicio = req.body.dataPrevInicio;
            andamentoEtapasModel.dataPrevTermino = req.body.dataPrevTermino;
            andamentoEtapasModel.dataFim = req.body.dataFim !=null ? req.body.dataFim : null;
            andamentoEtapasModel.descricaoEtapa = req.body.descricaoEtapa;
            let ok = await andamentoEtapasModel.gravar();
            if(ok){
                res.status(200).json({msg:"Etapa marcada como finalizada!"})
            }else{
                res.status(500).json({msg:"Erro ao marcar etapa como finalizada!"})
            }
        }else{
            res.status(400).json({msg: "Parâmetros inválidos!"});
        }
    }

    async excluir(req,res){
        if(req.params.idAndamento != undefined){
            let andamentoEtapasModel = new AndamentoEtapasModel();
            let ok = await andamentoEtapasModel.excluir(req.params.idAndamento);
            if(ok){
                res.status(200).json({msg:"Etapa excluída com sucesso!"})
            }else{
                res.status(500).json({msg:"Erro ao excluir etapa!"})
            }
        }else{
            res.status(400).json({msg: "Parâmetros inválidos!"});
        }
    }
}

module.exports = AndamentoEtapasController;