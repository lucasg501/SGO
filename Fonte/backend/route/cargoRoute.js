const express = require('express');
const CargoController = require('../controller/cargoController');
const router = express.Router();
let ctrl = new CargoController();

router.get('/listar', (req,res) =>{
    // #swagger.tags = ['Cargos']
    // #swagger.summary = 'Lista todos os cargos'
    ctrl.listar(req,res);
});

module.exports = router;