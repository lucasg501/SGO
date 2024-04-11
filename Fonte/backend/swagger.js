const swaggerAutogen = require("swagger-autogen");
const Funcionario = require("./model/funcionario.js");
const Etapas = require('./model/etapaModel.js');
const AreaAtuacaop = require('./model/areaAtuacaoModel.js');

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
            funcionario: new Funcionario(999, "Teste Funcionário", 99999999, "", 0),
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