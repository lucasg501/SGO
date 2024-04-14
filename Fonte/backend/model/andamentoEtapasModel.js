const Database = require("../utils/database");

const banco = new Database();

class AndamentoEtapasModel {

    #idObra;
    #idEtapa;
    #dataPrevInicio;
    #dataPrevTermino;
    #dataFim;
    #descricaoEtapa;

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

    constructor(idObra, idEtapa, dataPrevInicio, dataPrevTermino, dataFim, descricaoEtapa) {

        this.#idObra = idObra;
        this.#idEtapa = idEtapa;
        this.#dataPrevInicio = dataPrevInicio;
        this.#dataPrevTermino = dataPrevTermino;
        this.#dataFim = dataFim;
        this.#descricaoEtapa = descricaoEtapa;
    }

    async gravar() {

        let sql = "insert into tb_AndamentoEtapas values(?, ?, ?, ?, ?, ?)";
        let valores = [this.#idObra, this.#idEtapa, this.#dataPrevInicio, this.#dataPrevTermino, this.#dataFim, this.#descricaoEtapa];

        let ok = await banco.ExecutaComandoNonQuery(sql, valores);

        return ok;
    }

    async alterar() {

        let sql = `update tb_AndamentoEtapas set dataPrevInicio = ?, dataPrevTermino = ?, dataFim = ?, descricaoEtapa = ?
        where idObra = ? and idEtapa = ?`;
        let valores = [this.#dataPrevInicio, this.#dataPrevTermino, this.#dataFim, this.#descricaoEtapa, this.#idObra, this.#idEtapa];

        let ok = await banco.ExecutaComandoNonQuery(sql, valores);

        return ok;
    }
}

module.exports = AndamentoEtapasModel;