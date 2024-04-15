const Database = require('../utils/database.js');
const banco = new Database();

class servicosModel {
    #idServico;
    #descServico;
    #valorServico;
    #idObra;
    #idParceiro;

    get idServico() { return this.#idServico; } set idServico(idServico) { this.#idServico = idServico; }
    get descServico() { return this.#descServico; } set descServico(descServico) { this.#descServico = descServico; }
    get valorServico() { return this.#valorServico; } set valorServico(valorServico) { this.#valorServico = valorServico; }
    get idObra() { return this.#idObra; } set idObra(idObra) { this.#idObra = idObra; }
    get idParceiro() { return this.#idParceiro; } set idParceiro(idParceiro) { this.#idParceiro = idParceiro; }

    constructor(idServico, descServico, valorServico, idObra, idParceiro) {
        this.#idServico = idServico;
        this.#descServico = descServico;
        this.#valorServico = valorServico;
        this.#idObra = idObra;
        this.#idParceiro = idParceiro;
    }

    toJSON() {
        return {
            "idServico": this.#idServico,
            "descServico": this.#descServico,
            "valorServico": this.#valorServico,
            "idObra": this.#idObra,
            "idParceiro": this.#idParceiro
        }
    }

    async gravar() {
        if (this.#idServico === 0) {
            let sql = 'insert into tb_Servicos (descricaoServico, valorServico, idObra, idParceiro) values(?, ?, ?, ?)';
            let valores = [this.#descServico, this.#valorServico, this.#idObra, this.#idParceiro];
            let ok = await banco.ExecutaComandoNonQuery(sql, valores);
            return ok;
        } else {
            let sql = 'update tb_Servicos set descricaoServico = ?, valorServico = ?, idObra = ?, idParceiro = ? where idServico = ?';
            let valores = [this.#descServico, this.#valorServico, this.#idObra, this.#idParceiro, this.#idServico];
            let ok = await banco.ExecutaComandoNonQuery(sql, valores);
            return ok;
        }
    }

    async listar() {
        let sql = 'select * from tb_Servicos';
        let rows = await banco.ExecutaComando(sql);
        let lista = [];
        for (let i = 0; i < rows.length; i++) {
            lista.push(new servicosModel(rows[i]['idServico'], rows[i]['descricaoServico'], rows[i]['valorServico'], rows[i]['idObra'], rows[i]['idParceiro']));
        }
        return lista;
    }

    async obter(idServico) {
        let sql = 'select * from tb_Servicos where idServico = ?';
        let valores = [idServico];
        let rows = await banco.ExecutaComando(sql, valores);
        if (rows.length > 0) {
            let servico = new servicosModel(rows[0]['idServico'], rows[0]['descricaoServico'], rows[0]['valorServico'], rows[0]['idObra'], rows[0]['idParceiro']);
            return servico;
        }
        return null;
    }

    async excluir(idServico) {
        let sql = 'delete from tb_Servicos where idServico = ?';
        let valores = [idServico];
        let ok = await banco.ExecutaComandoNonQuery(sql, valores);
        return ok;
    }
}

module.exports = servicosModel;