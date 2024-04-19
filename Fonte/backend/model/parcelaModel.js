const Database = require("../utils/database");

const banco = new Database();

class ParcelaModel {

    #numParcela;
    #dataVencimento;
    #dataRecebimento;
    #valorParcela;
    #idObra;

    get numParcela() { return this.#numParcela; }
    set numParcela(novoNum) { this.#numParcela = novoNum; }
    get dataVencimento() { return this.#dataVencimento; }
    set dataVencimento(novaData) { this.#dataVencimento = novaData; }
    get dataRecebimento() { return this.#dataRecebimento; }
    set dataRecebimento(novaData) { this.#dataRecebimento = novaData; }
    get valorParcela() { return this.#valorParcela; }
    set valorParcela(novoValor) { this.#valorParcela = novoValor; }
    get idObra() { return this.#idObra; }
    set idObra(novoId) { this.#idObra = novoId; }

    constructor(numParcela, dataVencimento, dataRecebimento, valorParcela, idObra) {

        this.#numParcela = numParcela;
        this.#dataVencimento = dataVencimento;
        this.#dataRecebimento = dataRecebimento;
        this.#valorParcela = valorParcela;
        this.#idObra = idObra;
    }

    async gravar() {

        if (this.#numParcela == 0) {
            
            let sql = "insert into tb_Parcelas (dataVencimento, valorParcela, idObra) values (?, ?, ?)";
            let valores = [this.#dataVencimento, this.#valorParcela, this.#idObra];

            let ok = await banco.ExecutaComandoNonQuery(sql, valores);

            return ok;
        }
        else {
            let sql = "update tb_Parcelas set dataVencimento = ?, dataRecebimento = ?, valorParcela = ?, idObra = ? where numParcela = ?";
            let valores = [this.#dataVencimento, this.#dataRecebimento, this.#valorParcela, this.#idObra, this.#numParcela];

            let ok = await banco.ExecutaComandoNonQuery(sql, valores);

            return ok;
        }
    }

    async obterParcelasPorObra(idObra) {

        let sql = "select * from tb_Parcelas where idObra = ? order by dataVencimento";
        let valores = [idObra];

        let rows = await banco.ExecutaComando(sql, valores);
        let listaRetorno = [];

        for (let i = 0; i < rows.length; i++) {
            let row = rows[i];
            listaRetorno.push(new ParcelaModel(row['numParcela'], row['dataVencimento'], row['dataRecebimento'], row['valorParcela'], 
            row['idObra']));
        }

        return listaRetorno;
    }

    async listar() {

        let sql = "select * from tb_Parcelas order by dataVencimento";
        let rows = await banco.ExecutaComando(sql);

        let listaRetorno = [];

        for (let i = 0; i < rows.length; i++) {
            let row = rows[i];
            listaRetorno.push(new ParcelaModel(row['numParcela'], row['dataVencimento'], row['dataRecebimento'], row['valorParcela'], 
            row['idObra']))
        }

        return listaRetorno;
    }

    async obter(numParcela) {
        
        let sql = "select * from tb_Parcelas where numParcela = ?";
        let valores = [numParcela];

        let rows = await banco.ExecutaComando(sql, valores);

        if (rows.length > 0) {
            let row = rows[0];
            let parcela = new ParcelaModel(row['numParcela'], row['dataVencimento'], row['dataRecebimento'], row['valorParcela'], 
            row['idObra']);

            return parcela;
        }

        return null;
    }

    async excluirParcelasObra(idObra) {

        let sql = "delete from tb_Parcelas where idObra = ?";
        let valores = [idObra];

        let ok = await banco.ExecutaComandoNonQuery(sql, valores);
        
        return ok;
    }

    toJSON() {

        return {

            "numParcela": this.#numParcela,
            "dataVencimento": this.#dataVencimento,
            "dataRecebimento": this.#dataRecebimento,
            "valorParcela": this.#valorParcela,
            "idObra": this.#idObra
        }
    }
}

module.exports = ParcelaModel;