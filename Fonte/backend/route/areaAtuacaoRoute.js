const express = require('express');
const AreaAtuacaoController = require('../controller/areaAtuacaoController.js');

const router = express.Router();

let ctrl = new AreaAtuacaoController();

router.get('/listar', (req,res) =>{
    // #swagger.tags = ['Area Atuação']
    // #swagger.summary = 'Lista as áreas de atuação cadastradas'
    ctrl.listar(req,res);
});

router.get(`/obter/:idAreaAtuacao`, (req,res) =>{
    // #swagger.tags = ['Area Atenção']
    // #swagger.summary = 'Obtem uma area de atenção especifica'
    ctrl.obter(req,res);
});

module.exports = router;