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
        let sql;
        let valores;

        if (this.#idAndamento == 0) {
            sql = "INSERT INTO tb_AndamentoEtapas (idObra, idEtapa, dataPrevInicio, dataPrevTermino, dataFim, descricaoEtapa) VALUES (?, ?, ?, ?, ?, ?)";
            valores = [this.#idObra, this.#idEtapa, this.#dataPrevInicio, this.#dataPrevTermino, this.#dataFim, this.#descricaoEtapa];
        } else {
            sql = "UPDATE tb_AndamentoEtapas SET idObra = ?, idEtapa = ?, dataPrevInicio = ?, dataPrevTermino = ?, dataFim = ?, descricaoEtapa = ? WHERE idAndamento = ?";
            valores = [this.#idObra, this.#idEtapa, this.#dataPrevInicio, this.#dataPrevTermino, this.#dataFim, this.#descricaoEtapa, this.#idAndamento];
        }

        try {
            const ok = await banco.ExecutaComandoNonQuery(sql, valores);
            return ok;
        } catch (error) {
            console.error("Erro ao gravar o andamento da etapa:", error);
            return false;
        }
    }

    async obterEtapasPorObra(idObra) {
        let sql = 'select * from tb_AndamentoEtapas where idObra = ?';
        let valores = [idObra];
        let rows = await banco.ExecutaComando(sql, valores);
        let lista = [];
        for (let i = 0; i < rows.length; i++) {
            lista.push(new AndamentoEtapasModel(rows[i]['idObra'], rows[i]['idEtapa'], rows[i]['dataPrevInicio'], rows[i]['dataPrevTermino'],rows[i]['dataFim'], rows[i]['descricaoEtapa'], rows[i]['idAndamento']));
        }
        return lista;
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

    async obter(idAndamento){
        let sql = 'select * from tb_AndamentoEtapas where idAndamento = ?';
        let valores = [idAndamento];
        let rows = await banco.ExecutaComando(sql, valores);
        if(rows.length>0){
            let etapa = new AndamentoEtapasModel(rows[0]['idObra'], rows[0]['idEtapa'], rows[0]['dataPrevInicio'], rows[0]['dataPrevTermino'],
                rows[0]['dataFim'], rows[0]['descricaoEtapa'], rows[0]['idAndamento']);
            return etapa;
        }
        return null;
    }

    async excluir(idAndamento){
        let sql = 'delete from tb_AndamentoEtapas where idAndamento = ?';
        let valores = [idAndamento];
        let ok = await banco.ExecutaComandoNonQuery(sql, valores);
        return ok;
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