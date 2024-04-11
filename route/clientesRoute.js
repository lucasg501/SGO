const express = require('express');
const ClientesController = require('../controller/clienteController.js');

const router = express.Router();

let ctrl = new ClientesController();

router.get('/listar', (req,res) =>{
    // #swagger.tags = ['Clientes']
    // #swagger.summary = 'Lista os clientes cadastrados'
    ctrl.listar(req,res);
});

router.get('/obter/:idCli', (req,res) =>{
    // #swagger.tags = ['Clientes']
    // #swagger.summary = 'Lista um cliente especifico'
    ctrl.obter(req,res);
});

router.put('/alterar/', (req,res) =>{
    // #swagger.tags = ['Clientes']
    // #swagger.summary = 'Altera um cliente especifico'
    ctrl.alterar(req,res);
});

router.post('/gravar', (req,res) =>{
    // #swagger.tags = ['Clientes']
    // #swagger.summary = 'Cria um novo cliente'
    ctrl.gravar(req,res);
});

router.delete('/excluir/:idCli', (req,res) =>{
    // #swagger.tags = ['Clientes']
    // #swagger.summary = 'Exclui um cliente especifico'
    ctrl.excluir(req,res);
})

module.exports = router;