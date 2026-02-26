/**
 * PATCH /notificaciones/leer-todas
 * Marcar todas las notificaciones como leídas
 */

const router = require('express').Router();
const { markAllAsRead } = require('../../utils/notificationService');
const { sendResponse } = require('../../utils/responseHandler');

router.patch('/', async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.adminId || req.userId;

    const result = await markAllAsRead(userId);

    return sendResponse(res, 200, { 
      modifiedCount: result.modifiedCount 
    }, `${result.modifiedCount} notificaciones marcadas como leídas`);

  } catch (error) {
    console.error('Error marcando todas las notificaciones como leídas:', error);
    return sendResponse(res, 500, {}, 'Error al marcar notificaciones');
  }
});

module.exports = router;
