const ClientesModel = require('../model/clientesModel.js');

class ClientesController{

    async gravar(req,res){
        if(Object.keys(req.body).length > 0){
            let clientesModel = new ClientesModel();

            clientesModel.idCli = 0;
            clientesModel.nomeCli = req.body.nomeCli;
            clientesModel.telCli = req.body.telCli;
            clientesModel.emailCli = req.body.emailCli;
            clientesModel.rgCli = req.body.rgCli;
            clientesModel.cpfCli = req.body.cpfCli;
            clientesModel.enderecoCli = req.body.enderecoCli;
            clientesModel.bairroCli = req.body.bairroCli;
            clientesModel.cidadeCli = req.body.cidadeCli;
            clientesModel.cepCli = req.body.cepCli;
            let ok = await clientesModel.gravar();
            if(ok){
                res.status(200).json({msg:"Cliente gravado com sucesso!"});
            }else{
                res.status(500).json({msg:"Erro ao gravar o cliente!"});
            }
        }else{
            res.status(400).json({msg:"Parâmetros inválidos!"});
        }
    }

    async alterar(req,res){
        if(Object.keys(req.body).length > 0){
            let clientesModel = new ClientesModel();

            clientesModel.idCli = req.body.idCli;
            clientesModel.nomeCli = req.body.nomeCli;
            clientesModel.telCli = req.body.telCli;
            clientesModel.emailCli = req.body.emailCli;
            clientesModel.rgCli = req.body.rgCli;
            clientesModel.cpfCli = req.body.cpfCli;
            clientesModel.enderecoCli = req.body.enderecoCli;
            clientesModel.bairroCli = req.body.bairroCli;
            clientesModel.cidadeCli = req.body.cidadeCli;
            clientesModel.cepCli = req.body.cepCli;
            let ok = await clientesModel.gravar();
            if(ok){
                res.status(200).json({msg:"Cliente alterado com sucesso!"});
            }else{
                res.status(500).json({msg:"Erro ao alterar o cliente!"});
            }
        }else{
            res.status(400).json({msg:"Parâmetros inválidos!"});
        }
    }

    async listar(req,res){
        let clientesModel = new ClientesModel();
        let lista = await clientesModel.listar();
        let listaRetorno = [];
        for(let i=0; i<lista.length; i++){
            listaRetorno.push(lista[i].toJSON());
        }
        res.status(200).json(listaRetorno);
    }

    async excluir(req,res){
        try{
            if(req.params.idCli != null){
                let clientesModel = new ClientesModel();
                let ok = await clientesModel.excluir(req.params.idCli);
                if(ok){
                    res.status(200).json({msg:"Cliente excluído com sucesso!"});
                }else{
                    res.status(500).json({msg:"Erro ao excluir cliente, tente novamente após apagar todos os dados relacionados a ele. Serviços, Parcelas e Obras!"});
                }
            }else{
                res.status(400).json({msg:"Parâmetros inválidos!"});
            }
        }catch(e){
            res.status(500).json({msg:e.message});
        }
    }

    async obter(req,res){
        if(req.params.idCli != undefined){
            let clientesModel = new ClientesModel();
            clientesModel = await clientesModel.obter(req.params.idCli);
            if(clientesModel == null){
                res.status(400).json({msg:"Cliente não encontrado!"});
            }else{
                res.status(200).json(clientesModel.toJSON());
            }
        }else{
            res.status(400).json({msg:"Parâmetros inválidos!"});
        }
    }

    async obterNome(req,res){
        if(req.params.nomeCli != undefined){
            let clientesModel = new ClientesModel();
            clientesModel = await clientesModel.obterPorNome(req.params.nomeCli);
            if(clientesModel == null){
                res.status(400).json({msg:"Cliente não encontrado!"});
            }else{
                res.status(200).json(clientesModel.toJSON());
            }
        }else{
            res.status(400).json({msg:"Parâmetros inválidos!"});
        }
    }
}

module.exports = ClientesController;