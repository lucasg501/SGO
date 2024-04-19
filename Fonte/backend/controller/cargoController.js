const CargoModel = require('../model/cargoModel.js');

class CargoController{

    async listar(req,res){
        let cargoModel = new CargoModel();
        let lista = await cargoModel.listar();
        let listaRetorno = [];
        for(let i=0; i<lista.length; i++){
            listaRetorno.push(lista[i].toJSON());
        }
        res.status(200).json(listaRetorno);
    }
}

module.exports = CargoController;