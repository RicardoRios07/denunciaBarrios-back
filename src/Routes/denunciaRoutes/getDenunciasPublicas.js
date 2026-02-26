/**
 * GET /denuncias/publicas
 * Obtener denuncias de la comunidad (solo validadas+)
 * Excluye denuncias del usuario autenticado (las ve en "Mis Denuncias")
 */

const router = require('express').Router();
const Denuncia = require('../../Models/denuncia');
const verifyToken = require('../../Middleware/validate-token');
const { sendResponse } = require('../../utils/responseHandler');

router.post('/', verifyToken, async (req, res) => {
  try {
    const usuarioId = req.user._id;

    // Buscar denuncias en estados públicos (validadas+) excluyendo las del usuario
    const denuncias = await Denuncia.find({
      estado: { $in: ['VERIFICADA_NO_ATENDIDA', 'EN_PROCESO', 'ATENDIDA'] },
      idDenunciante: { $ne: usuarioId }, // Excluir propias denuncias
      isDeleted: false
    })
      .select('tituloDenuncia descripcion categoria ubicacion evidencia estado fechaHora')
      .sort({ fechaHora: -1 })
      .limit(100); // Limitar para performance

    console.log(`✓ ${denuncias.length} denuncias públicas encontradas para usuario ${usuarioId}`);

    return sendResponse(res, 200, { denuncias }, `${denuncias.length} denuncias de la comunidad`);

  } catch (error) {
    console.error('Error obteniendo denuncias públicas:', error);
    return sendResponse(res, 500, {}, 'Error al obtener denuncias públicas');
  }
});

module.exports = router;
