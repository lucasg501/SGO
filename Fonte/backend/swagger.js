const swaggerAutogen = require("swagger-autogen");
const Funcionario = require("./modelo/funcionario");

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
            funcionario: new Funcionario(999, "Teste Funcionário", 99999999, "", 0)
        }
    }
}

let outputJson = "./outputSwagger.json";
let endpoints = ["./index.js"];

swaggerAutogen(outputJson, endpoints, doc)
.then(r => {
    require('./index.js');
});