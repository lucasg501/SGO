const CargoModel = require('../model/cargoModel.js');

class CargoController{

    async listar(req,res){
        try {
            let cargoModel = new CargoModel();
            let lista = await cargoModel.listar();
            let listaRetorno = [];
            for(let i=0; i<lista.length; i++){
                listaRetorno.push(lista[i].toJSON());
            }
            res.status(200).json(listaRetorno);
        }
        catch(ex) {
            res.status(500).json({msg: "Erro ao carregar cargos!"});
        }
    }

    async obter(req, res) {

        try {
            if (req.params.idCargo != undefined) {

                let cargoModel = new CargoModel();
                cargoModel = await cargoModel.obter(req.params.idCargo);

                if (cargoModel != null) {
                    res.status(200).json({cargoModel});
                }
                else {
                    res.status(404).json({msg: "Cargo não encontrado!"});
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

module.exports = CargoController;