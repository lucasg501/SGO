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