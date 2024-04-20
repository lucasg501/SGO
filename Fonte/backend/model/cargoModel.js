const Database = require('../utils/database.js');
const banco = new Database();

class CargoModel {
    #idCargo;
    #nomeCargo;

    get idCargo(){return this.#idCargo;} set idCargo(idCargo){this.#idCargo = idCargo;}
    get nomeCargo(){return this.#nomeCargo;} set nomeCargo(nomeCargo){this.#nomeCargo = nomeCargo;}

    constructor(idCargo, nomeCargo){
        this.#idCargo = idCargo;
        this.#nomeCargo = nomeCargo;
    }

    toJSON(){
        return{
            'idCargo':this.#idCargo,
            'nomeCargo':this.#nomeCargo
        }
    }

    async listar(){
        let sql = 'select * from tb_Cargo';
        let rows = await banco.ExecutaComando(sql);
        let lista = [];
        for(let i=0; i<rows.length; i++){
            lista.push(new CargoModel(rows[i]['idCargo'], rows[i]['nomeCargo']));
        }
        return lista;
    }

}

module.exports = CargoModel;