/**
 * Rutas para Personal Municipal
 * Todas protegidas con verifyPersonalToken middleware
 */

const express = require('express');
const router = express.Router();
const verifyPersonalToken = require('../Middleware/verifyPersonalToken');

// Importar endpoints
const getDenunciasAsignadas = require('./personalRoutes/getDenunciasAsignadas');
const cambiarEnProceso = require('./personalRoutes/cambiarEnProceso');
const finalizarAtencion = require('./personalRoutes/finalizarAtencion');
const getEstadisticas = require('./personalRoutes/getEstadisticas');

// Aplicar middleware de autenticación a todas las rutas
router.use(verifyPersonalToken);

// Registrar rutas
router.use('/denuncias-asignadas', getDenunciasAsignadas);
router.use('/denuncias', cambiarEnProceso);
router.use('/denuncias', finalizarAtencion);
router.use('/estadisticas', getEstadisticas);

module.exports = router;
