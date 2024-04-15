const Database = require("../utils/database");

const banco = new Database();

class AndamentoEtapasModel {

    #idAndamento;
    #idObra;
    #idEtapa;
    #dataPrevInicio;
    #dataPrevTermino;
    #dataFim;
    #descricaoEtapa;


    get idAndamento() { return this.#idAndamento; }
    set idAndamento(idAndamento) { this.#idAndamento = idAndamento };
    get idObra() { return this.#idObra; }
    set idObra(novoId) { this.#idObra = novoId; }
    get idEtapa() { return this.#idEtapa; }
    set idEtapa(novoId) { this.#idEtapa = novoId; }
    get dataPrevInicio() { return this.#dataPrevInicio; }
    set dataPrevInicio(novaData) { this.#dataPrevInicio = novaData; }
    get dataPrevTermino() { return this.#dataPrevTermino; }
    set dataPrevTermino(novaData) { this.#dataPrevTermino = novaData; }
    get dataFim() { return this.#dataFim; }
    set dataFim(novaData) { this.#dataFim = novaData; }
    get descricaoEtapa() { return this.#descricaoEtapa; }
    set descricaoEtapa(novaDesc) { this.#descricaoEtapa = novaDesc; }

    constructor(idObra, idEtapa, dataPrevInicio, dataPrevTermino, dataFim, descricaoEtapa, idAndamento) {

        this.#idObra = idObra;
        this.#idEtapa = idEtapa;
        this.#dataPrevInicio = dataPrevInicio;
        this.#dataPrevTermino = dataPrevTermino;
        this.#dataFim = dataFim;
        this.#descricaoEtapa = descricaoEtapa;
        this.#idAndamento = idAndamento;
    }

    async gravar() {
        if (this.#idAndamento == 0) {
            let sql = "insert into tb_AndamentoEtapas (idObra, idEtapa, dataPrevInicio, dataPrevTermino, dataFim, descricaoEtapa) values(?, ?, ?, ?, ?, ?)";
            let valores = [this.#idObra, this.#idEtapa, this.#dataPrevInicio, this.#dataPrevTermino, this.#dataFim, this.#descricaoEtapa];
            let ok = await banco.ExecutaComandoNonQuery(sql, valores);
            return ok;
        } else {
            let sql = "update tb_AndamentoEtapas set idObra = ?, idEtapa = ?, dataPrevInicio = ?, dataPrevTermino = ?, dataFim = ?, descricaoEtapa = ? where idAndamento = ?";
            let valores = [this.#idObra, this.#idEtapa, this.#dataPrevInicio, this.#dataPrevTermino, this.#dataFim, this.#descricaoEtapa, this.#idAndamento];
            let ok = await banco.ExecutaComandoNonQuery(sql, valores);
            return ok;
        }
    }

    async obterEtapasPorObra(idObra) {

        let sql = "select * from tb_AndamentoEtapas where idObra = ?";
        let valores = [idObra];

        let rows = await banco.ExecutaComando(sql, valores);
        let listaRetorno = [];

        for (let i = 0; i < rows.length; i++) {
            let row = rows[i];
            listaRetorno.push(new AndamentoEtapasModel(row['idObra'], row['idEtapa'], row['dataPrevInicio'], row['dataPrevTermino'],
                row['dataFim'], row['descricaoEtapa']));
        }

        return listaRetorno;
    }

    async listar() {
        let sql = 'select * from tb_AndamentoEtapas';
        let rows = await banco.ExecutaComando(sql);
        let lista = [];
        for (let i = 0; i < rows.length; i++) {
            lista.push(new AndamentoEtapasModel(rows[i]['idObra'], rows[i]['idEtapa'], rows[i]['dataPrevInicio'], rows[i]['dataPrevTermino'],rows[i]['dataFim'], rows[i]['descricaoEtapa'], rows[i]['idAndamento']));
        }
        return lista;
    }

    toJSON() {
        return {

            "idObra": this.#idObra,
            "idEtapa": this.#idEtapa,
            "dataPrevInicio": this.#dataPrevInicio,
            "dataPrevTermino": this.#dataPrevTermino,
            "dataFim": this.#dataFim,
            "descricaoEtapa": this.#descricaoEtapa,
            'idAndamento': this.#idAndamento
        };
    }
}

module.exports = AndamentoEtapasModel;