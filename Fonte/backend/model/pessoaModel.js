const Database = require("../utils/database");

const banco = new Database();

class PessoaModel {

    #idParceiro;
    #idPessoa;
    #nome;
    #telefone;

    get idParceiro() {
        return this.#idParceiro;
    }

    set idParceiro(novoId) {
        this.#idParceiro = novoId;
    }

    get idPessoa() {
        return this.#idPessoa;
    }

    set idPessoa(novoId) {
        this.#idPessoa = novoId;
    }

    get nome() {
        return this.#nome;
    }

    set nome(novoNome) {
        this.#nome = novoNome;
    }

    get telefone() {
        return this.#telefone;
    }

    set telefone(novoTel) {
        this.#telefone = novoTel;
    }

    constructor(idParceiro, idPessoa, nome, telefone) {

        this.#idParceiro = idParceiro;
        this.#idPessoa = idPessoa;
        this.#nome = nome;
        this.#telefone = telefone;
    }

    async gravar() {

        if (this.#idParceiro == 0)
        {
            let sql = "insert into tb_Pessoa (idParceiro, idPessoa, nomePessoa, telPessoa) values (?, ?, ?)";
            let valores = [this.#idParceiro, this.#idPessoa, this.#nome, this.#telefone];

            let ok = await banco.ExecutaComandoNonQuery(sql, valores);

            return ok;
        }
        else {

            let sql = "update tb_Pessoa set nomePessoa = ?, telPessoa = ? where idParceiro = ?";
            let valores = [this.#nome, this.#telefone, this.#idParceiro];

            let ok = await banco.ExecutaComandoNonQuery(sql, valores);

            return ok;
        }
    }
}

module.exports = PessoaModel;