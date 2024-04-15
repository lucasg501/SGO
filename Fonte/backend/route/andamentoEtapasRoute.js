const express = require('express');
const AndamentoEtapasController = require('../controller/andamentoEtapasController');

const router = express.Router();

let ctrl = new AndamentoEtapasController();

router.post('/gravar', (req, res) => {

    // #swagger.tags = ['Andamento Etapas']
    // #swagger.summary = 'Grava etapas para uma obra'

    ctrl.gravar(req, res);
});

router.get('/obterEtapasPorObra/:idObra', (req, res) => {

    // #swagger.tags = ['Andamento Etapas']
    // #swagger.summary = 'Obtem etapas da obra especificada'

    ctrl.obterEtapasPorObra(req, res);
});

router.get('/listar', (req,res)=>{

    // #swagger.tags = ['Andamento Etapas']
    // #swagger.summary = 'Lista todas as etapas'
    ctrl.listar(req,res);
});

module.exports = router;