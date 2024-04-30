const Database = require("../utils/database");

const banco = new Database();

class DiariaModel {

    #idDiaria;
    #dia;
    #valorDiaria;
    #dataPgto;
    #idFuncionario;

    get idDiaria() { return this.#idDiaria; }
    set idDiaria(idDiaria) { this.#idDiaria = idDiaria; }
    get dia() { return this.#dia; }
    set dia(dia) { this.#dia = dia; }
    get valorDiaria() { return this.#valorDiaria; }
    set valorDiaria(valorDiaria) { this.#valorDiaria = valorDiaria; }
    get dataPgto() { return this.#dataPgto; }
    set dataPgto(dataPgto) { this.#dataPgto = dataPgto; }
    get idFuncionario() { return this.#idFuncionario; }
    set idFuncionario(idFuncionario) { this.#idFuncionario = idFuncionario; }

    constructor(idDiaria, dia, valorDiaria, dataPgto, idFuncionario) {

        this.#idDiaria = idDiaria;
        this.#dia = dia;
        this.#valorDiaria = valorDiaria;
        this.#dataPgto = dataPgto;
        this.#idFuncionario = idFuncionario;
    }

    async gravar() {

        if (this.#idDiaria == 0) {
            
            let sql = "insert into tb_Diarias (dia, valorDiaria, dataPgto, idFuncionario) values (?, ?, ?, ?)";
            let valores = [this.#dia, this.#valorDiaria, this.#dataPgto, this.#idFuncionario];

            let ok = await banco.ExecutaComandoNonQuery(sql, valores);

            return ok;
        }
        else {

            let sql = "update tb_Diarias set dia = ?, valorDiaria = ?, dataPgto = ?, idFuncionario = ? where idDiaria = ?";
            let valores = [this.#dia, this.#valorDiaria, this.#dataPgto, this.#idFuncionario, this.#idDiaria];

            let ok = await banco.ExecutaComandoNonQuery(sql, valores);

            return ok;
        }
    }

    async obterDiariasFuncionario(idFuncionario) {

        let sql = "select * from tb_Diarias where idFuncionario = ? order by dia";
        let valores = [idFuncionario];

        let rows = await banco.ExecutaComando(sql, valores);
        let listaRetorno = [];

        for (let i = 0; i < rows.length; i++) {
            let row = rows[i];
            listaRetorno.push(new DiariaModel(row['idDiaria'], row['dia'], row['valorDiaria'], row['dataPgto'], row['idFuncionario']));
        }

        return listaRetorno;
    }

    async excluirDiariasFuncionario(idFuncionario) {

        let sql = "delete from tb_Diarias where idFuncionario = ?";
        let valores = [idFuncionario];

        let ok = await banco.ExecutaComandoNonQuery(sql, valores);

        return ok;
    }

    toJSON() {

        return {
            "idDiaria": this.#idDiaria,
            "dia": this.#dia,
            "valorDiaria": this.#valorDiaria,
            "dataPgto": this.#dataPgto,
            "idFuncionario": this.#idFuncionario
        };
    }
}

module.exports = DiariaModel;