const express = require('express');
const ObrasController = require('../controller/obrasController');

let ctrl = new ObrasController();
const router = express.Router();

router.get('/listar', (req,res) =>{
    // #swagger.tags = ['Obras']
    // #swagger.summary = 'Lista as obras cadastradas'
    ctrl.listar(req,res);
});

router.get('/obter/:idObra', (req,res) =>{
    // #swagger.tags = ['Obras']
    // #swagger.summary = 'Obtem uma obra especifica'
    ctrl.obter(req,res);
});

router.put('/alterar', (req,res) =>{
    // #swagger.tags = ['Obras']
    // #swagger.summary = 'Altera uma obra'
    ctrl.alterar(req,res);
});

router.post('/gravar', (req,res) =>{
    // #swagger.tags = ['Obras']
    // #swagger.summary = 'Cria uma nova obra'
    ctrl.gravar(req,res);
});

router.delete('/excluir/:idObra', (req,res) =>{
    // #swagger.tags = ['Obras']
    // #swagger.summary = 'Exclui uma obra'
    ctrl.excluir(req,res);
});


module.exports = router;