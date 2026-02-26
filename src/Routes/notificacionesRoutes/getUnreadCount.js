/**
 * GET /notificaciones/no-leidas/count
 * Obtener contador de notificaciones no leídas
 */

const router = require('express').Router();
const { getUnreadCount } = require('../../utils/notificationService');
const { sendResponse } = require('../../utils/responseHandler');

router.get('/', async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.adminId || req.userId;

    const count = await getUnreadCount(userId);

    return sendResponse(res, 200, { count }, 'Contador obtenido');

  } catch (error) {
    console.error('Error obteniendo contador de no leídas:', error);
    return sendResponse(res, 500, {}, 'Error al obtener contador');
  }
});

module.exports = router;
