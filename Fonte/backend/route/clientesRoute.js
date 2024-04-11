const express = require('express');
const ClientesController = require('../controller/clienteController.js');

const router = express.Router();

let ctrl = new ClientesController();

router.get('/listar', (req,res) =>{
    ctrl.listar(req,res);
});

router.get('/obter/:idCli', (req,res) =>{
    ctrl.obter(req,res);
});

router.put('/alterar/', (req,res) =>{
    ctrl.alterar(req,res);
});

router.post('/gravar', (req,res) =>{
    ctrl.gravar(req,res);
});

router.delete('/excluir/:idCli', (req,res) =>{
    ctrl.excluir(req,res);
})

module.exports = router;