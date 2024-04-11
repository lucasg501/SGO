const Pessoa = require("./pessoa");

class Funcionario extends Pessoa {

    #cargo;
    #salarioFinal;

    get cargo() {
        return this.#cargo;
    }

    set cargo(novoCargo) {
        this.#cargo = novoCargo;
    }

    get salarioFinal() {
        return this.#salarioFinal;
    }

    set salarioFinal(novoSalario) {
        this.#salarioFinal = novoSalario;
    }

    constructor(cpf, nome, telefone, cargo, salarioFinal) {

        super(cpf, nome, telefone);
        this.#cargo = cargo;
        this.#salarioFinal = salarioFinal;
    }
}

module.exports = Funcionario;