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

module.exports = router;