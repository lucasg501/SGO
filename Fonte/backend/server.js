const express = require('express');
const swaggerJson = require('./outputSwagger.json');
const swaggerUi = require('swagger-ui-express');
const clientesRota = require('./route/clientesRoute.js');
const areaAtuacaoRota = require('./route/areaAtuacaoRoute.js');
const etapaRota = require('./route/etapaRoute.js');
const funcionarioRota = require('./route/funcionarioRoute.js');

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

app.listen(porta, () => {
    console.log(`Servidor rodando em http://localhost:${porta}\n`);
    console.log(`Consultar documentação em http://localhost:${porta}/docs\n`);
});