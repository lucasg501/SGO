const Database = require("../utils/database");
const PessoaModel = require("./pessoaModel");
const Pessoa = require("./pessoaModel");

const banco = new Database();

class ParceiroModel extends Pessoa {

    #idParceiro;
    #cargo;
    #salario;
    #descTrabalho;
    #idAreaAtuacao;

    get idParceiro() {
        return this.#idParceiro;
    }

    set idParceiro(novoId) {
        this.#idParceiro = novoId;
    }

    get cargo() {
        return this.#cargo;
    }

    set cargo(novoCargo) {
        this.#cargo = novoCargo;
    }

    get salario() {
        return this.#salario;
    }

    set salario(novoSalario) {
        this.#salario = novoSalario;
    }

    get descTrabalho() {
        return this.#descTrabalho;
    }

    set descTrabalho(novaDescricao) {
        this.#descTrabalho = novaDescricao;
    }

    get idAreaAtuacao() {
        return this.#idAreaAtuacao;
    }

    set idAreaAtuacao(novoId) {
        this.#idAreaAtuacao = novoId;
    }

    constructor(idParceiro, nome, telefone, cargo, salario, descTrabalho, idAreaAtuacao) {

        this.#idParceiro = idParceiro;
        super(nome, telefone);
        this.#cargo = cargo;
        this.#salario = salario;
        this.#descTrabalho = descTrabalho;
        this.#idAreaAtuacao = idAreaAtuacao;
    }

    async gravar() {

        if (this.#idParceiro == 0) {

            let sql = `insert into tb_Parceiros (nomeParceiro, telParceiro, cargoParceiro, salarioParceiro, idAreaAtuacao, descTrabalho)
            values (?, ?, ?, ?)`;
            let valores = [super.nome, super.telefone,
                this.#cargo, this.#salario, this.#idAreaAtuacao, this.#descTrabalho];

            let ok = await banco.ExecutaComandoNonQuery(sql, valores);

            return ok;
        }
        else {

            let sql = "update tb_Parceiros set cargo = ?, salario = ?, idAreaAtuacao = ?, descTrabalho = ? where idParceiro = ?";
            let valores = [this.#cargo, this.#salario, this.#idAreaAtuacao, this.#descTrabalho, this.#idParceiro];

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

            lista.push(new ParceiroModel(row['idParceiro'], "", "", row['cargo'], row['salario'], row['idPessoa'], row['idAreaAtuacao']));
        }

        return lista;
    }

    async obter(id) {

        let sql = "select * from tb_Parceiros where idParceiro = ?";
        let valores = [id];

        let rows = await banco.ExecutaComando(sql, valores);

        if (rows.length > 0) {

            let row = rows[0];
            return new ParceiroModel(row['idParceiro'], "", "", row['cargo'], row['salario'], row['idPessoa'], row['idAreaAtuacao']);
        }

        return null;
    }

    async excluir(id) {

        let sql = "delete from tb_Parceiros where idParceiro = ?";
        let valores = [id];

        let ok = await banco.ExecutaComandoNonQuery(sql, valores);

        return ok;
    }

    toJSON() {

        return {
            "id": this.#idParceiro,
            "nome": super.nome,
            "telefone": super.telefone,
            "cargo": this.#cargo,
            "salario": this.#salario,
            "descTrabalho": this.#descTrabalho,
            "idAreaAtuacao": this.#idAreaAtuacao
        }
    }
}

module.exports = ParceiroModel;