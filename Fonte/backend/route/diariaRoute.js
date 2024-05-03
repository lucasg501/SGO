const express = require('express');
const DiariaController = require('../controller/diariaController');
const router = express.Router();

let ctrl = new DiariaController();

router.post('/gravar', (req, res) => {
    
    // #swagger.tags = ['Diárias']
    // #swagger.summary = 'Grava as diárias para um funcionário'

    ctrl.gravar(req, res);
});

router.put('/alterar', (req, res) => {

    // #swagger.tags = ['Diárias']
    // #swagger.summary = 'Altera uma diária'

    ctrl.alterar(req, res);
});

router.get('/obter/:idDiaria', (req, res) => {
    
    // #swagger.tags = ['Diárias']
    // #swagger.summary = 'Obtém uma diária'

    ctrl.obter(req, res);
});

router.get('/obterDiariasFuncionario/:idFuncionario', (req, res) => {

    // #swagger.tags = ['Diárias']
    // #swagger.summary = 'Obtém as diárias de um funcionário'

    ctrl.obterDiariasFuncionario(req, res);
});

router.delete('/excluirDiariasFuncionario/:idFuncionario', (req, res) => {

    // #swagger.tags = ['Diárias']
    // #swagger.summary = 'Exclui as diárias um funcionário'

    ctrl.excluirDiariasFuncionario(req, res);
});

module.exports = router;