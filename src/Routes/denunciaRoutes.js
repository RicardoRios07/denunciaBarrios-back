const router = require('express').Router();
const getDenunciasUser = require('./denunciaRoutes/getDenunciasUser');
const nuevaDenuncia = require('./denunciaRoutes/nuevaDenuncia');
const eliminarDenuncia = require('./denunciaRoutes/eliminarDenuncia');
const getAllDenuncias = require('./denunciaRoutes/getAllDenuncias');
const getDetailDenuncia = require('./denunciaRoutes/getDetailDenuncia');
const getDenunciasPublicas = require('./denunciaRoutes/getDenunciasPublicas');


router.use('/getDenunciasUser', getDenunciasUser);
router.use('/nuevaDenuncia', nuevaDenuncia);
router.use('/eliminarDenuncia', eliminarDenuncia);
router.use('/getAllDenuncias', getAllDenuncias);
router.use('/getDetailDenuncia', getDetailDenuncia);
router.use('/publicas', getDenunciasPublicas);

module.exports = router;