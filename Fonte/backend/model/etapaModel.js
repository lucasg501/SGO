const Database = require('../utils/database.js');

const banco = new Database();

class EtapaModel {
    #idEtapa;
    #nomeEtapa;

    get idEtapa(){return this.#idEtapa;} set idEtapa(idEtapa){this.#idEtapa = idEtapa};
    get nomeEtapa(){return this.#nomeEtapa;} set nomeEtapa(nomeEtapa){this.#nomeEtapa = nomeEtapa};

    constructor(idEtapa, nomeEtapa){
        this.#idEtapa = idEtapa;
        this.#nomeEtapa = nomeEtapa;
    }

    toJSON(){
        return{
            'idEtapa':this.#idEtapa,
            'nomeEtapa':this.#nomeEtapa
        }
    }

    async listar(){
        let sql = 'select * from tb_Etapas';
        let rows = await banco.ExecutaComando(sql);
        let lista = [];
        for(let i=0; i<rows.length; i++){
            lista.push(new EtapaModel(rows[i]['idEtapa'], rows[i]['nomeEtapa']));
        }
        return lista;
    }
    
}

module.exports = EtapaModel