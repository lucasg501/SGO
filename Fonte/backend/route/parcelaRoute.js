const express = require('express');
const ParcelaController = require('../controller/parcelaController');

const router = express.Router();
let ctrl = new ParcelaController();

router.post('/gravar', (req, res) => {

    // #swagger.tags = ['Parcelas']
    // #swagger.summary = 'Grava parcelas para uma obra'

    ctrl.gravar(req, res);
})

router.get('/obterParcelasPorObra/:idObra', (req, res) => {

    // #swagger.tags = ['Parcelas']
    // #swagger.summary = 'Obtem parcelas da obra especificada'
    
    ctrl.obterParcelasPorObra(req, res);
})

router.get('/listar', (req, res) => {

    // #swagger.tags = ['Parcelas']
    // #swagger.summary = 'Obtem todas as parcelas'

    ctrl.listar(req, res);
})

router.get('/obter/:numParcela', (req, res) => {

    // #swagger.tags = ['Parcelas']
    // #swagger.summary = 'Obtem uma parcela específica'

    ctrl.obter(req, res);
});

router.put('/alterar', (req,res) =>{

    // #swagger.tags = ['Parcelas']
    // #swagger.summary = 'Altera uma parcela'
    ctrl.alterar(req,res);
});

router.delete('/excluirParcelasObra/:idObra', (req, res) => {

    // #swagger.tags = ['Parcelas']
    // #swagger.summary = 'Exclui parcelas da obra especificada'
    
    ctrl.excluirParcelasObra(req, res);
});

router.get('/parcelasVencidas/', (req, res) => {

    // #swagger.tags = ['Parcelas']
    // #swagger.summary = 'Procura parcelas vencidas'

    ctrl.procurarParcelasVencidas(req, res);
});

router.put('/cancelarRecebimento/:numParcela', (req, res) => {

    // #swagger.tags = ['Parcelas']
    // #swagger.summary = 'Cancela o recebimento de uma parcela'

    ctrl.cancelarRecebimento(req, res);
});

module.exports = router;