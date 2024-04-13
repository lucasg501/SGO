const swaggerAutogen = require("swagger-autogen")({openapi: "3.0.0"});
const Funcionario = require("./model/funcionarioModel.js");
const Etapas = require('./model/etapaModel.js');
const AreaAtuacaop = require('./model/areaAtuacaoModel.js');
const ParceiroModel = require("./model/parceiroModel.js");

const doc = {

    info: {
        title: 'SGO - Sistema Gerenciador de Obras',
        description: 'API de desenvolvimento do Sistema Gerenciador de Obras'
    },
    host: 'localhost:4000',
    securityDefinitions: {
        apiKeyAuth: {
            type: 'apiKey',
            in: 'header',
            name: 'chaveapi',
            description: 'Chave para autorização da API'
        }
    },
    components: {
        schemas: {
            funcionario: new Funcionario(0, "Teste Funcionário", "(99)99999-9999", "Teste").toJSON(),
            parceiro: new ParceiroModel(0, "Teste Parceiro", "(99)99999-9999", "Teste", 999.99, "Descrição teste", 1).toJSON(),
            etapas: new Etapas(999, "Laje"),
            areaAtuacao: new AreaAtuacaop(999, "Eletricista")
        }
    }
}

let outputJson = "./outputSwagger.json";
let endpoints = ["./server.js"];

swaggerAutogen(outputJson, endpoints, doc)
.then(r => {
    require('./server.js');
});