const Database = require("../utils/database");
const PessoaModel = require("./pessoaModel");

const banco = new Database();

class FuncionarioModel extends PessoaModel {

    #idFunc;
    #cargoFunc;

    get cargoFunc() {
        return this.#cargoFunc;
    }

    set cargoFunc(novocargoFunc) {
        this.#cargoFunc = novocargoFunc;
    }

    constructor(nome, telefone, idFunc, cargoFunc) {

        super(nome, telefone);
        this.#idFunc = idFunc;
        this.#cargoFunc = cargoFunc;
    }

    async gravar() {

        if (this.#idFunc == 0) {

            let sql = "insert into tb_Funcionario (cargoFuncionario) values = ?";
            let valores = [this.#cargoFunc];

            let ok = await banco.ExecutaComandoNonQuery(sql, valores);

            return ok;
        }
        else {

            let sql = "update tb_Funcionario set cargoFuncionario = ?";
            let valores = [this.#cargoFunc];

            let ok = await banco.ExecutaComandoNonQuery(sql, valores);

            return ok;
        }
    }

    async listar() {

        let sql = "select * from tb_Funcionario";

        let rows = await banco.ExecutaComando(sql);
        let lista = [];

        for (let i = 0; i < rows.length; i++) {
            
            let row = rows[i];
            lista.push(new FuncionarioModel(this.#idFunc, this.#cargoFunc));
        }

        return lista;
    }

    async obter(id) {

        let sql = "select * from tb_funcionario where idFuncionario = ?";
        let valores = [id];

        let rows = await banco.ExecutaComando(sql, valores);

        if (rows.length > 0) {
            
            let row = rows[0];
            return new FuncionarioModel("", "", row['idFunc'], row['cargoFunc']);
        }

        return null;
    }

    async excluir(id) {

        let sql = "delete from tb_funcionario where idFuncionario = ?";
        let valores = [id];

        let ok = await banco.ExecutaComandoNonQuery(sql, valores);

        return ok;
    }

    toJSON() {

        return {
            "id": this.#idFunc,
            "cargo": this.#cargoFunc
        }
    }
}

module.exports = FuncionarioModel;