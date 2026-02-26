/**
 * POST /pusher/auth
 * Autenticar canal privado de Pusher
 */

const router = require('express').Router();
const { authenticateChannel } = require('../../services/pusherService');
const { sendResponse } = require('../../utils/responseHandler');

router.post('/', async (req, res) => {
  try {
    const { socket_id, channel_name } = req.body;
    const userId = req.user?._id || req.user?.adminId || req.userId;
    const userRole = req.userRole || (req.user?.adminId ? 'ADMIN' : 'USER');

    if (!socket_id || !channel_name) {
      return sendResponse(res, 400, {}, 'Faltan parámetros: socket_id y channel_name');
    }

    // Validar que el usuario puede acceder al canal
    const expectedUserChannel = `private-user-${userId}`;
    const adminsChannel = 'private-admins-channel';

    if (channel_name === expectedUserChannel) {
      // Usuario accediendo a su canal privado
      const authResponse = authenticateChannel(socket_id, channel_name);
      return res.json(authResponse);
    } else if (channel_name === adminsChannel && userRole === 'ADMIN') {
      // Admin accediendo al canal de admins
      const authResponse = authenticateChannel(socket_id, channel_name);
      return res.json(authResponse);
    } else {
      return sendResponse(res, 403, {}, 'No tiene permisos para acceder a este canal');
    }

  } catch (error) {
    console.error('Error autenticando canal de Pusher:', error);
    return sendResponse(res, 500, {}, 'Error al autenticar canal');
  }
});

module.exports = router;
