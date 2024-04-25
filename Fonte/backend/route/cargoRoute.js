const express = require('express');
const CargoController = require('../controller/cargoController');
const router = express.Router();
let ctrl = new CargoController();

router.get('/listar', (req,res) =>{
    // #swagger.tags = ['Cargos']
    // #swagger.summary = 'Lista todos os cargos'
    ctrl.listar(req,res);
});

router.get('/obter/:idCargo', (req, res) => {

    // #swagger.tags = ['Cargos']
    // #swagger.summary = 'Obtém o cargo especificado'

    ctrl.obter(req, res);
})

module.exports = router;