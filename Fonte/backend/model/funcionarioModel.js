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

    constructor(idFunc, nome, telefone, cargoFunc) {

        this.#idFunc = idFunc;
        super(nome, telefone);
        this.#cargoFunc = cargoFunc;
    }

    async gravar() {

        if (this.#idFunc == 0) {

            let sql = "insert into tb_Funcionario (nomeFuncionario, telFuncionario, cargoFuncionario) values (?, ?, ?)";
            let valores = [super.nome, super.telefone, this.#cargoFunc];

            let ok = await banco.ExecutaComandoNonQuery(sql, valores);

            return ok;
        }
        else {

            let sql = "update tb_Funcionario set nomeFuncionario = ?, telFuncionario = ?, cargoFuncionario = ?";
            let valores = [super.nome, super.telefone, this.#cargoFunc];

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
            lista.push(new FuncionarioModel(row['idFuncionario'], row['nomeFuncionario'], row['telFuncionario'], row['cargoFuncionario']));
        }

        return lista;
    }

    async obter(id) {

        let sql = "select * from tb_funcionario where idFuncionario = ?";
        let valores = [id];

        let rows = await banco.ExecutaComando(sql, valores);

        if (rows.length > 0) {
            
            let row = rows[0];
            return new FuncionarioModel(row['idFuncionario'], row['nomeFuncionario'], row['telFuncionario'], row['cargoFuncionario']);
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
            "nome": super.nome,
            "telefone": super.telefone,
            "cargo": this.#cargoFunc
        }
    }
}

module.exports = FuncionarioModel;