/**
 * Middleware para verificar token de Personal Municipal
 * Valida que el usuario autenticado sea Personal con rol PERSONAL
 */

const jwt = require('jsonwebtoken');

module.exports = function verifyPersonalToken(req, res, next) {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({
      code: 401,
      status: 'error',
      message: 'Acceso denegado. No se proporcionó token de autenticación',
      data: {}
    });
  }

  try {
    // Eliminar 'Bearer ' del token si existe
    const cleanToken = token.startsWith('Bearer ') ? token.slice(7) : token;

    // Verificar token con TOKEN_SECRET (mismo que usuarios normales y personal)
    const verified = jwt.verify(cleanToken, process.env.TOKEN_SECRET);

    // Verificar que el rol sea PERSONAL
    if (verified.role !== 'PERSONAL') {
      return res.status(403).json({
        code: 403,
        status: 'error',
        message: 'Acceso denegado. Solo personal municipal puede acceder a este recurso',
        data: {}
      });
    }

    // Agregar usuario verificado a la request
    req.user = verified;
    req.userId = verified._id;
    req.userRole = 'PERSONAL';

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        code: 401,
        status: 'error',
        message: 'Token expirado. Por favor, inicie sesión nuevamente',
        data: {}
      });
    }

    return res.status(400).json({
      code: 400,
      status: 'error',
      message: 'Token no válido',
      data: {}
    });
  }
};
