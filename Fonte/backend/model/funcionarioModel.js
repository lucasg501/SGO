const Database = require("../utils/database");
const PessoaModel = require("./pessoaModel");

const banco = new Database();

class FuncionarioModel extends PessoaModel {

    #idFunc;
    #cargoFunc;

    get idFunc() {
        return this.#idFunc;
    }

    set idFunc(novoId) {
        this.#idFunc = novoId;
    }

    get cargoFunc() {
        return this.#cargoFunc;
    }

    set cargoFunc(novocargoFunc) {
        this.#cargoFunc = novocargoFunc;
    }

    constructor(idFunc, nome, telefone, cargoFunc) {

        super(nome, telefone);
        this.#idFunc = idFunc;
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

            let sql = "update tb_Funcionario set nomeFuncionario = ?, telFuncionario = ?, cargoFuncionario = ? where idFuncionario = ?";
            let valores = [super.nome, super.telefone, this.#cargoFunc, this.#idFunc];

            let ok = await banco.ExecutaComandoNonQuery(sql, valores);

            return ok;
        }
    }

    async listar() {

        let sql = "select * from tb_Funcionario order by nomeFuncionario";

        let rows = await banco.ExecutaComando(sql);
        let lista = [];

        for (let i = 0; i < rows.length; i++) {
            
            let row = rows[i];
            lista.push(new FuncionarioModel(row['idFuncionario'], row['nomeFuncionario'], row['telFuncionario'], row['cargoFuncionario']));
        }

        return lista;
    }

    async obter(id) {

        let sql = "select * from tb_Funcionario where idFuncionario = ?";
        let valores = [id];

        let rows = await banco.ExecutaComando(sql, valores);

        if (rows.length > 0) {
            
            let row = rows[0];
            return new FuncionarioModel(row['idFuncionario'], row['nomeFuncionario'], row['telFuncionario'], row['cargoFuncionario']);
        }

        return null;
    }

    async excluir(id) {

        let sql = "delete from tb_Funcionario where idFuncionario = ?";
        let valores = [id];

        let ok = await banco.ExecutaComandoNonQuery(sql, valores);

        return ok;
    }

    toJSON() {

        return {
            "idFuncionario": this.#idFunc,
            "nomeFuncionario": super.nome,
            "telFuncionario": super.telefone,
            "cargoFuncionario": this.#cargoFunc
        }
    }
}

module.exports = FuncionarioModel;