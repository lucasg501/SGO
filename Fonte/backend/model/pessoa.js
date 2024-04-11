class Pessoa {

    #cpf;
    #nome;
    #telefone;

    get cpf() {
        return this.#cpf;
    }

    set cpf(novoCpf) {
        this.#cpf = novoCpf;
    }

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

    constructor(cpf, nome, telefone) {

        this.#cpf = cpf;
        this.#nome = nome;
        this.#telefone = telefone;
    }
}

module.exports = Pessoa;