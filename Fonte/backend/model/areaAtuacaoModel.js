const Database = require('../utils/database.js');
const banco = new Database();

class AreaAtuacaoModel {
    #idArea;
    #nomeAtuacao;

    get idArea() {return this.#idArea;} set idArea(idArea) {this.#idArea = idArea;}

    get nomeAtuacao() {return this.#nomeAtuacao;} set nomeAtuacao(nomeAtuacao) {this.#nomeAtuacao = nomeAtuacao;}

    constructor(idArea, nomeAtuacao) {
        this.#idArea = idArea;
        this.#nomeAtuacao = nomeAtuacao;
    }

    toJSON(){
        return{
            'idArea': this.#idArea,
            'nomeAtuacao': this.#nomeAtuacao
        }
    }

    async listar(){
        let sql = 'select * from tb_AreaAtuacao';
        let rows = await banco.ExecutaComando(sql);
        let lista = [];
        for(let i=0; i<rows.length; i++){
            lista.push(new AreaAtuacaoModel(rows[i]['idAreaAtuacao'], rows[i]['nomeAtuacao']));
        }
        return lista;
    }
}

module.exports = AreaAtuacaoModel;