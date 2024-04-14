const Database = require("../utils/database");
const PessoaModel = require("./pessoaModel");

const banco = new Database();

class ParceiroModel extends PessoaModel {

    #idParceiro;
    #idAreaAtuacao;

    constructor(idParceiro, nome, telefone, idAreaAtuacao) {
        super(nome, telefone); // Chamada ao construtor da classe pai PessoaModel
        this.#idParceiro = idParceiro;
        this.#idAreaAtuacao = idAreaAtuacao;
    }

    async gravar() {

        if (this.#idParceiro === 0) {

            let sql = `INSERT INTO tb_Parceiros (nomeParceiro, telParceiro, idAreaAtuacao) VALUES (?, ?, ?)`;
            let valores = [this.nome, this.telefone, this.#idAreaAtuacao];

            let ok = await banco.ExecutaComandoNonQuery(sql, valores);

            return ok;
        }
        else {

            let sql = `UPDATE tb_Parceiros SET nomeParceiro = ?, telParceiro = ?, idAreaAtuacao = ? WHERE idParceiro = ?`;
            let valores = [this.nome, this.telefone, this.#idAreaAtuacao, this.#idParceiro];

            let ok = await banco.ExecutaComandoNonQuery(sql, valores);

            return ok;
        }
    }

    async listar() {

        let sql = "select * from tb_Parceiros";

        let rows = await banco.ExecutaComando(sql);
        let lista = [];

        for (let i = 0; i < rows.length; i++) {
            let row = rows[i];

            lista.push(new ParceiroModel(row['idParceiro'], row['nomeParceiro'], row['telParceiro'],row['idAreaAtuacao']));
        }

        return lista;
    }

    async obter(id) {

        let sql = "select * from tb_Parceiros where idParceiro = ?";
        let valores = [id];

        let rows = await banco.ExecutaComando(sql, valores);

        if (rows.length > 0) {

            let row = rows[0];
            return new ParceiroModel(row['idParceiro'], row['nomeParceiro'], row['telParceiro'],row['idAreaAtuacao']);
        }

        return null;
    }

    async obterParceirosArea(id){
        let sql = `SELECT * 
        FROM tb_Parceiros AS p
        INNER JOIN tb_AreaAtuacao AS a ON p.idAreaAtuacao = a.idAreaAtuacao
        WHERE p.idAreaAtuacao = ?
        `;
        let valores = [id];
        let rows = await banco.ExecutaComando(sql, valores);
        
        let listaRetorno = [];

        for (let i = 0; i < rows.length; i++) {
            let row = rows[i];
            listaRetorno.push(new ParceiroModel(row['idParceiro'], row['nomeParceiro'], row['telParceiro'],row['idAreaAtuacao']));
        }

        return listaRetorno;
    }

    async excluir(id) {

        let sql = "delete from tb_Parceiros where idParceiro = ?";
        let valores = [id];

        let ok = await banco.ExecutaComandoNonQuery(sql, valores);

        return ok;
    }

    toJSON() {

        return {
            "idParceiro": this.#idParceiro,
            "nomeParceiro": super.nome,
            "telParceiro": super.telefone,
            "idAreaAtuacao": this.#idAreaAtuacao
        }
    }
}

module.exports = ParceiroModel;