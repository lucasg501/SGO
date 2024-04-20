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
}

module.exports = CargoController;