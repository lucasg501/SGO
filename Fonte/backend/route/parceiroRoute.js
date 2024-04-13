const express = require('express');
const ParceiroController = require('../controller/parceiroController');

const router = express.Router();

let ctrl = new ParceiroController();

router.get('/listar', (req, res) => {
    // #swagger.tags = ['Parceiros']
    // #swagger.summary = 'Lista os parceiros cadastrados'

    ctrl.listar(req, res);
});

router.get('/obter/:idParceiro', (req, res) => {
    // #swagger.tags = ['Parceiros']
    // #swagger.summary = 'Obtem um parceiro específico'

    ctrl.obter(req, res);
});

router.put('/alterar', (req, res) => {
    // #swagger.tags = ['Parceiros']
    // #swagger.summary = 'Altera um parceiro'
    /*
        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        $ref: "#/components/schemas/parceiro"
                    }
                }
            }
        }
    */

    ctrl.alterar(req, res);
});

router.post('/gravar', (req, res) => {
    // #swagger.tags = ['Parceiros']
    // #swagger.summary = 'Grava um parceiro'
    /*
        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        $ref: "#/components/schemas/parceiro"
                    }
                }
            }
        }
    */

    ctrl.gravar(req, res);
});

router.delete('/excluir/:idParceiro', (req, res) => {
    // #swagger.tags = ['Parceiros']
    // #swagger.summary = 'Exclui um parceiro'

    ctrl.excluir(req, res);
});

module.exports = router;