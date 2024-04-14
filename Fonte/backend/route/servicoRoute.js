const express = require('express');
const ServicoController = require('../controller/servicosController.js');

let ctrl = new ServicoController();
const router = express.Router();

router.get('/listar', (req,res) =>{
    // #swagger.tags = ['Servicos']
    // #swagger.summary = 'Lista todos os servicos'
    ctrl.listar(req,res);
});

router.get('/obter/:idServico', (req,res) =>{
    // #swagger.tags = ['Servicos']
    // #swagger.summary = 'Lista um servico especifico'
    ctrl.obter(req,res);
});

router.post('/gravar', (req,res) =>{
    // #swagger.tags = ['Servicos']
    // #swagger.summary = 'Cria um novo servico'
    ctrl.gravar(req,res);
});

router.put('/alterar', (req,res) =>{
    // #swagger.tags = ['Servicos']
    // #swagger.summary = 'Altera um servico'
    ctrl.alterar(req,res);
});

router.delete('/excluir/:idServico', (req, res) => {
    // #swagger.tags = ['Servicos']
    // #swagger.summary = 'Exclui um servico'
    ctrl.excluir(req, res);
});

module.exports = router;