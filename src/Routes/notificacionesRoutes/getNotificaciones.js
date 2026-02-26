/**
 * GET /notificaciones
 * Obtener notificaciones del usuario autenticado
 */

const router = require('express').Router();
const { getNotifications } = require('../../utils/notificationService');
const { sendResponse } = require('../../utils/responseHandler');

router.get('/', async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.adminId || req.userId;
    const { page = 1, limit = 20, unreadOnly = false } = req.query;

    const result = await getNotifications(userId, {
      page: parseInt(page),
      limit: parseInt(limit),
      unreadOnly: unreadOnly === 'true' || unreadOnly === true
    });

    return sendResponse(res, 200, result, 'Notificaciones obtenidas');

  } catch (error) {
    console.error('Error obteniendo notificaciones:', error);
    return sendResponse(res, 500, {}, 'Error al obtener notificaciones');
  }
});

module.exports = router;
