const Pessoa = require("./pessoa");

class Parceiro extends Pessoa {

    #valorServico;
    #descTrabalho;
    #idAreaAtuacao;

    get valorServico() {
        return this.#valorServico;
    }

    set valorServico(novoValor) {
        this.#valorServico = novoValor;
    }

    get descTrabalho() {
        return this.#descTrabalho;
    }

    set descTrabalho(novaDescricao) {
        this.#descTrabalho = novaDescricao;
    }

    get idAreaAtuacao() {
        return this.#idAreaAtuacao;
    }

    set idAreaAtuacao(novoId) {
        this.#idAreaAtuacao = novoId;
    }

    constructor(cpf, nome, telefone, valorServico, descTrabalho, idAreaAtuacao) {

        super(cpf, nome, telefone);
        this.#valorServico = valorServico;
        this.#descTrabalho = descTrabalho;
        this.#idAreaAtuacao = idAreaAtuacao;
    }
}

module.exports = Parceiro;