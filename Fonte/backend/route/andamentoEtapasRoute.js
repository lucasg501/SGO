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

router.get('/obter/:idAndamento', (req,res) =>{

    // #swagger.tags = ['Andamento Etapas']
    // #swagger.summary = 'Obtem um andamento especifico'
    ctrl.obter(req,res);
});

router.put('/alterar', (req,res) =>{

    // #swagger.tags = ['Andamento Etapas']
    // #swagger.summary = 'Altera um andamento'
    ctrl.alterar(req,res);
})

router.delete('/excluir/:idAndamento', (req,res) =>{

    // #swagger.tags = ['Andamento Etapas']
    // #swagger.summary = 'Exclui um andamento'
    ctrl.excluir(req,res);
})

module.exports = router;