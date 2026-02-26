/**
 * GET /personal/denuncias-asignadas
 * Obtener denuncias asignadas al personal autenticado
 */

const router = require('express').Router();
const Denuncia = require('../../Models/denuncia');
const { sendResponse } = require('../../utils/responseHandler');

router.get('/', async (req, res) => {
  try {
    const personalId = req.userId; // Del middleware verifyPersonalToken

    // Buscar denuncias asignadas al personal que están en VERIFICADA_NO_ATENDIDA o EN_PROCESO
    const denuncias = await Denuncia.find({
      assigneeId: personalId,
      estado: { $in: ['VERIFICADA_NO_ATENDIDA', 'EN_PROCESO'] },
      isDeleted: false
    })
      .populate('idDenunciante', 'nombreCompleto cedula numTelefono')
      .sort({ estado: 1, fechaHora: -1 }); // VERIFICADA antes que EN_PROCESO, luego por fecha

    console.log(`✓ ${denuncias.length} denuncias encontradas para personal ${personalId}`);

    return sendResponse(res, 200, { denuncias }, `${denuncias.length} denuncias asignadas`);

  } catch (error) {
    console.error('Error obteniendo denuncias asignadas:', error);
    return sendResponse(res, 500, {}, 'Error al obtener denuncias asignadas');
  }
});

module.exports = router;
