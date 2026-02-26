/**
 * PATCH /notificaciones/:id/leer
 * Marcar una notificación como leída
 */

const router = require('express').Router();
const { markAsRead } = require('../../utils/notificationService');
const { sendResponse } = require('../../utils/responseHandler');

router.patch('/:id/leer', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?._id || req.user?.adminId || req.userId;

    const notificacion = await markAsRead(id, userId);

    return sendResponse(res, 200, { notificacion }, 'Notificación marcada como leída');

  } catch (error) {
    console.error('Error marcando notificación como leída:', error);
    if (error.message.includes('no encontrada') || error.message.includes('no pertenece')) {
      return sendResponse(res, 404, {}, error.message);
    }
    return sendResponse(res, 500, {}, 'Error al marcar notificación');
  }
});

module.exports = router;
