class PessoaModel {

    #nome;
    #telefone;

    get nome() {
        return this.#nome;
    }

    set nome(novoNome) {
        this.#nome = novoNome;
    }

    get telefone() {
        return this.#telefone;
    }

    set telefone(novoTel) {
        this.#telefone = novoTel;
    }

    constructor(nome, telefone) {

        this.#nome = nome;
        this.#telefone = telefone;
    }
}

module.exports = PessoaModel;