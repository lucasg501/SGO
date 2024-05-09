const Database = require('../utils/database.js');
const banco = new Database();

class clientesModel{
    #idCli;
    #nomeCli;
    #telCli;
    #emailCli;
    #rgCli;
    #cpfCli;
    #enderecoCli;
    #bairroCli;
    #cidadeCli;
    #cepCli;

    get idCli(){return this.#idCli;} set idCli(idCli){this.#idCli = idCli;}
    get nomeCli(){return this.#nomeCli;} set nomeCli(nomeCli){this.#nomeCli = nomeCli;}
    get telCli(){return this.#telCli;} set telCli(telCli){this.#telCli = telCli;}
    get emailCli(){return this.#emailCli;} set emailCli(emailCli){this.#emailCli = emailCli;}
    get rgCli(){return this.#rgCli;} set rgCli(rgCli){this.#rgCli = rgCli;}
    get cpfCli(){return this.#cpfCli;} set cpfCli(cpfCli){this.#cpfCli = cpfCli;}
    get enderecoCli(){return this.#enderecoCli;} set enderecoCli(enderecoCli){this.#enderecoCli = enderecoCli;}
    get bairroCli(){return this.#bairroCli;} set bairroCli(bairroCli){this.#bairroCli = bairroCli;}
    get cidadeCli(){return this.#cidadeCli;} set cidadeCli(cidadeCli){this.#cidadeCli = cidadeCli;}
    get cepCli(){return this.#cepCli;} set cepCli(cepCli){this.#cepCli = cepCli;}

    constructor(idCli, nomeCli, telCli, emailCli, rgCli, cpfCli, enderecoCli, bairroCli, cidadeCli, cepCli){
        this.#idCli = idCli;
        this.#nomeCli = nomeCli;
        this.#telCli = telCli;
        this.#emailCli = emailCli;
        this.#rgCli = rgCli;
        this.#cpfCli = cpfCli;
        this.#enderecoCli = enderecoCli;
        this.#bairroCli = bairroCli;
        this.#cidadeCli = cidadeCli;
        this.#cepCli = cepCli;
    }

    toJSON(){
        return{
            'idCli':this.#idCli,
            'nomeCli':this.#nomeCli,
            'telCli':this.#telCli,
            'emailCli':this.#emailCli,
            'rgCli':this.#rgCli,
            'cpfCli':this.#cpfCli,
            'enderecoCli':this.#enderecoCli,
            'bairroCli':this.#bairroCli,
            'cidadeCli':this.#cidadeCli,
            'cepCli':this.#cepCli
        }
    }

    async gravar(){
        if(this.#idCli == 0){
            let sql = 'insert into tb_Clientes(idCli, nomeCli, telCli, emailCli, rgCli, cpfCli, enderecoCli, bairro, cidade, cep) values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
            let valores = [this.#idCli, this.#nomeCli, this.#telCli, this.#emailCli, this.#rgCli, this.#cpfCli, this.#enderecoCli, this.#bairroCli, this.#cidadeCli, this.#cepCli];
            let ok = await banco.ExecutaComandoNonQuery(sql, valores);
            return ok;
        }else{
            let sql = 'update tb_Clientes set nomeCli = ?, telCli = ?, emailCli = ?, rgCli = ?, cpfCli = ?, enderecoCli = ?, bairro = ?, cidade = ?, cep = ? where idCli = ?';
            let valores = [this.#nomeCli, this.#telCli, this.#emailCli, this.#rgCli, this.#cpfCli, this.#enderecoCli, this.#bairroCli, this.#cidadeCli, this.#cepCli, this.#idCli];
            let ok = await banco.ExecutaComandoNonQuery(sql, valores);
            return ok;
        }
    }

    async listar(){
        let sql = 'select * from tb_Clientes order by nomeCli';
        let rows = await banco.ExecutaComando(sql);
        let lista = [];
        for(let i=0; i<rows.length; i++){
            lista.push(new clientesModel(rows[i]['idCli'],rows[i]['nomeCli'],rows[i]['telCli'],rows[i]['emailCli'],rows[i]['rgCli'],rows[i]['cpfCli'],rows[i]['enderecoCli'], rows[i]['bairro'], rows[i]['cidade'], rows[i]['cep']));
        }
        return(lista);
    }

    async obter(idCli){
        let sql = 'select * from tb_Clientes where idCli = ?';
        let valores = [idCli];
        let rows = await banco.ExecutaComando(sql, valores);
        if(rows.length > 0){
            let cliente = new clientesModel(rows[0]['idCli'],rows[0]['nomeCli'],rows[0]['telCli'],rows[0]['emailCli'],rows[0]['rgCli'],rows[0]['cpfCli'],rows[0]['enderecoCli'], rows[0]['bairro'], rows[0]['cidade'], rows[0]['cep']);
            return cliente;
        }
        return null;
    }

    async obterPorNome(nomeCli){
        let sql = `select * from tb_Clientes where nomeCli like '${nomeCli}%'`;
        let valores = [nomeCli];
        let rows = await banco.ExecutaComando(sql, valores);
        if(rows.length > 0){
            let cliente = new clientesModel(rows[0]['idCli'],rows[0]['nomeCli'],rows[0]['telCli'],rows[0]['emailCli'],rows[0]['rgCli'],rows[0]['cpfCli'],rows[0]['enderecoCli'], rows[0]['bairro'], rows[0]['cidade'], rows[0]['cep']);
            return cliente;
        }
        return null;
    }

    async excluir(idCli) {
        try {
            let sqlClientes = `DELETE FROM tb_Clientes WHERE idCli = ?`;
            let valoresClientes = [idCli];
            await banco.ExecutaComandoNonQuery(sqlClientes, valoresClientes);
    
            return true;
        } catch (error) {
            console.error("Erro ao excluir o cliente! Exclua os serviços, parcelas e obras ligadas a esse clientes antes de excluir o cliente!", error);
            return false;
        }
    }
    
    
}

module.exports = clientesModel;