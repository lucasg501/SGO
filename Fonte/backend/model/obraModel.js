const Database = require('../utils/database.js');
const banco = new Database();

class obraModel{
    #idObra;
    #endereco;
    #bairro;
    #cidade;
    #valorTotal;
    #dataInicio;
    #dataTermino;
    #contrato;
    #planta;
    #idCliente;

    get idObra(){return this.#idObra;} set idObra(idObra){this.#idObra = idObra};
    get endereco(){return this.#endereco;} set endereco(endereco){this.#endereco = endereco};
    get bairro(){return this.#bairro;} set bairro(bairro){this.#bairro = bairro};
    get cidade(){return this.#cidade;} set cidade(cidade){this.#cidade = cidade};
    get valorTotal(){return this.#valorTotal;} set valorTotal(valorTotal){this.#valorTotal = valorTotal};
    get dataInicio(){return this.#dataInicio;} set dataInicio(dataInicio){this.#dataInicio = dataInicio};
    get dataTermino(){return this.#dataTermino;} set dataTermino(dataTermino){this.#dataTermino = dataTermino};
    get contrato(){return this.#contrato;} set contrato(contrato){this.#contrato = contrato};
    get planta(){return this.#planta;} set planta(planta){this.#planta = planta};
    get idCliente(){return this.#idCliente;} set idCliente(idCliente){this.#idCliente = idCliente};

    constructor(idObra, endereco, bairro, cidade, valorTotal, dataInicio, dataTermino, contrato, planta, idCliente){
        this.#idObra = idObra;
        this.#endereco = endereco;
        this.#bairro = bairro;
        this.#cidade = cidade;
        this.#valorTotal = valorTotal;
        this.#dataInicio = dataInicio;
        this.#dataTermino = dataTermino;
        this.#contrato = contrato;
        this.#planta = planta;
        this.#idCliente = idCliente;
    }

    toJSON(){
        return{
            'idObra': this.#idObra,
            'endereco': this.#endereco,
            'bairro': this.#bairro,
            'cidade': this.#cidade,
            'valorTotal': this.#valorTotal,
            'dataInicio': this.#dataInicio,
            'dataTermino': this.#dataTermino,
            'contrato': this.#contrato,
            'planta': this.#planta,
            'idCliente': this.#idCliente
        }
    }

    async gravar(){
        if(this.#idObra == 0){
            let sql = 'insert into tb_Obras (endereco, bairro, cidade, valorTotal, dataInicio, dataTermino, contrato, planta, idCliente) values(?, ?, ?, ?, ?, ?, ?, ?, ?)';
            let valores = [this.#endereco, this.#bairro, this.#cidade, this.#valorTotal, this.#dataInicio, this.#dataTermino, this.#contrato, this.#planta, this.#idCliente];
            let ok = await banco.ExecutaComandoNonQuery(sql, valores);
            return ok;
        }else{
            let sql = 'update tb_Obras set endereco = ?, bairro = ?, cidade = ?, valorTotal = ?, dataInicio = ?, dataTermino = ?, contrato = ?, planta = ?, idCliente = ? where idObra = ?';
            let valores = [this.#endereco, this.#bairro, this.#cidade, this.#valorTotal, this.#dataInicio, this.#dataTermino, this.#contrato, this.#planta, this.#idCliente, this.#idObra];
            let ok = await banco.ExecutaComandoNonQuery(sql, valores);
            return ok;
        }
    }

    async listar(){
        let sql = 'select * from tb_Obras';
        let rows = await banco.ExecutaComando(sql);
        let lista = [];
        for(let i=0; i<rows.length; i++){
            lista.push(new obraModel(rows[i]['idObra'],rows[i]['endereco'],rows[i]['bairro'],rows[i]['cidade'],rows[i]['valorTotal'],rows[i]['dataInicio'],rows[i]['dataTermino'],rows[i]['contrato'],rows[i]['planta'],rows[i]['idCliente']));
        }
        return lista;
    }

    async obter(idObra){
        let sql = 'select * from tb_Obras where idObra = ?';
        let valores = [idObra];
        let rows = await banco.ExecutaComando(sql, valores);
        if(rows.length > 0){
            let obra = new obraModel(rows[0]['idObra'],rows[0]['endereco'],rows[0]['bairro'],rows[0]['cidade'],rows[0]['valorTotal'],rows[0]['dataInicio'],rows[0]['dataTermino'],rows[0]['contrato'],rows[0]['planta'],rows[0]['idCliente']);
            return obra;
        }
        return null;
    }

    async excluir(idObra){
        let sql = 'delete from tb_Obras where idObra = ?';
        let valores = [idObra];
        let ok = await banco.ExecutaComandoNonQuery(sql, valores);
        return ok;
    }
}

module.exports = obraModel;