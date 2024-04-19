const express = require('express');
const swaggerJson = require('./outputSwagger.json');
const swaggerUi = require('swagger-ui-express');
const clientesRota = require('./route/clientesRoute.js');
const areaAtuacaoRota = require('./route/areaAtuacaoRoute.js');
const etapaRota = require('./route/etapaRoute.js');
const funcionarioRota = require('./route/funcionarioRoute.js');
const parceirosRota = require('./route/parceiroRoute.js');
const obrasRota = require('./route/obrasRoute.js');
const servicosRota = require('./route/servicoRoute.js');
const andamentoEtapasRota = require('./route/andamentoEtapasRoute.js');
const parcelaRota = require('./route/parcelaRoute.js');
const cargoRota = require('./route/cargoRoute.js');

const cors = require('cors');

const app = express();
const porta = "4000";

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerJson));
app.use(express.json());
app.use(cors({origin:'http://localhost:3000', credentials: true}));
app.use('/clientes', clientesRota);
app.use('/areaAtuacao', areaAtuacaoRota);
app.use('/etapas', etapaRota);
app.use('/funcionarios', funcionarioRota);
app.use('/parceiros', parceirosRota);
app.use('/obras', obrasRota);
app.use('/servicos', servicosRota);
app.use('/andamentoEtapas', andamentoEtapasRota);
app.use('/parcelas', parcelaRota);
app.use('/cargos', cargoRota);

app.listen(porta, () => {
    console.log(`Servidor rodando em http://localhost:${porta}\n`);
    console.log(`Consultar documentação em http://localhost:${porta}/docs\n`);
});