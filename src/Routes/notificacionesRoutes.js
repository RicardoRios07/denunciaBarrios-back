/**
 * Rutas para Notificaciones
 * Accesibles por usuarios, admins y personal
 */

const express = require('express');
const router = express.Router();

// Middleware que acepta tanto validate-token como verifyAdminToken
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization');
  
  if (!token) {
    return res.status(401).json({
      code: 401,
      status: 'error',
      message: 'Acceso denegado. No se proporcionó token',
      data: {}
    });
  }

  try {
    const jwt = require('jsonwebtoken');
    const cleanToken = token.startsWith('Bearer ') ? token.slice(7) : token;
    
    // Primero intentar con TOKEN_SECRET (usuarios y personal)
    try {
      const verified = jwt.verify(cleanToken, process.env.TOKEN_SECRET);
      req.user = verified;
      req.userId = verified._id;
      req.userRole = verified.role || 'USER';
      return next();
    } catch (e) {
      // Si falla, intentar con SECRETO_ADMINS
      const verifiedAdmin = jwt.verify(cleanToken, process.env.SECRETO_ADMINS);
      req.user = { adminId: verifiedAdmin.adminId, _id: verifiedAdmin.adminId };
      req.userId = verifiedAdmin.adminId;
      req.userRole = 'ADMIN';
      return next();
    }
  } catch (error) {
    return res.status(400).json({
      code: 400,
      status: 'error',
      message: 'Token no válido',
      data: {}
    });
  }
};

// Importar endpoints
const getNotificaciones = require('./notificacionesRoutes/getNotificaciones');
const marcarLeida = require('./notificacionesRoutes/marcarLeida');
const marcarTodasLeidas = require('./notificacionesRoutes/marcarTodasLeidas');
const getUnreadCount = require('./notificacionesRoutes/getUnreadCount');
const pusherAuth = require('./notificacionesRoutes/pusherAuth');

// Aplicar middleware de autenticación
router.use(authMiddleware);

// Registrar rutas
router.get('/', getNotificaciones.routes || getNotificaciones);
router.patch('/:id/leer', marcarLeida.routes || marcarLeida);
router.patch('/leer-todas', marcarTodasLeidas.routes || marcarTodasLeidas);
router.get('/no-leidas/count', getUnreadCount.routes || getUnreadCount);

// Pusher auth (POST en /pusher/auth, debe ir en el main routes)
router.post('/pusher-auth', pusherAuth.routes || pusherAuth);

module.exports = router;
