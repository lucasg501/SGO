const express = require('express');
const FuncionarioController = require('../controller/funcionarioController');

const router = express.Router();

let ctrl = new FuncionarioController();

router.get('/listar', (req, res) => {
    // #swagger.tags = ['Funcionários']
    // #swagger.summary = 'Lista os funcionários cadastrados'

    ctrl.listar(req, res);
});

router.get('/obter/:idFuncionario', (req, res) => {
    // #swagger.tags = ['Funcionários']
    // #swagger.summary = 'Obtem um funcionário específico'

    ctrl.obter(req, res);
});

router.put('/alterar', (req, res) => {
    // #swagger.tags = ['Funcionários']
    // #swagger.summary = 'Altera um funcionário'
    /*
        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        $ref: "#/components/schemas/funcionario"
                    }
                }
            }
        }
    */

    ctrl.alterar(req, res);
});

router.post('/gravar', (req, res) => {
    // #swagger.tags = ['Funcionários']
    // #swagger.summary = 'Grava um funcionário'
    /*
        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        $ref: "#/components/schemas/funcionario"
                    }
                }
            }
        }
    */

    ctrl.gravar(req, res);
});

router.delete('/excluir/:idFuncionario', (req, res) => {
    // #swagger.tags = ['Funcionários']
    // #swagger.summary = 'Exclui um funcionário'

    ctrl.excluir(req, res);
});

module.exports = router;