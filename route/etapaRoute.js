const express = require('express');
const EtapaController = require('../controller/etapaController.js');
const router = express.Router();

let ctrl = new EtapaController();

router.get('/listar', (req,res) =>{
    // #swagger.tags = ['Etapas']
    // #swagger.summary = 'Lista todas as etapas cadastradas'
    ctrl.listar(req,res);
})

module.exports = router;