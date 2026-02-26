/**
 * Endpoint para validar una denuncia
 * PATCH /admin/denuncias/:id/validar
 */

const router = require('express').Router();
const Denuncia = require('../../Models/denuncia');
const User = require('../../Models/user');
const { createAndEmitNotification } = require('../../utils/notificationService');
const { sendResponse } = require('../../utils/responseHandler');

router.patch('/:id/validar', async (req, res) => {
  try {
    const { id } = req.params;
    const adminId = req.user?.adminId || req.user?._id;

    // Buscar la denuncia
    const denuncia = await Denuncia.findById(id);
    
    if (!denuncia) {
      return sendResponse(res, 404, {}, 'Denuncia no encontrada');
    }

    if (denuncia.isDeleted) {
      return sendResponse(res, 400, {}, 'Esta denuncia ha sido eliminada');
    }

    if (denuncia.estado !== 'REVISION') {
      return sendResponse(res, 400, {}, 'Solo se pueden validar denuncias en estado REVISION');
    }

    // Actualizar estado a VERIFICADA_NO_ATENDIDA
    denuncia.estado = 'VERIFICADA_NO_ATENDIDA';
    
    // Agregar entrada al historial
    denuncia.historialEstados.push({
      estado: 'VERIFICADA_NO_ATENDIDA',
      fecha: new Date(),
      adminResponsable: adminId,
      observaciones: 'Denuncia validada por administrador'
    });

    await denuncia.save();

    // Obtener datos del usuario para notificación
    const usuario = await User.findById(denuncia.idDenunciante);

    // Crear y emitir notificación al usuario
    if (usuario) {
      await createAndEmitNotification({
        userId: usuario._id,
        userModel: 'User',
        type: 'denuncia_validada',
        title: 'Denuncia Validada',
        message: `Su denuncia "${denuncia.tituloDenuncia}" ha sido validada y será atendida`,
        data: {
          denunciaId: denuncia._id,
          titulo: denuncia.tituloDenuncia
        },
        userEmail: usuario.email,
        emailData: {
          titulo: denuncia.tituloDenuncia,
          categoria: denuncia.categoria,
          denunciaId: denuncia._id
        }
      });
    }

    console.log(`✓ Denuncia ${id} validada por admin ${adminId}`);

    return sendResponse(res, 200, { denuncia }, 'Denuncia validada exitosamente');

  } catch (error) {
    console.error('Error validando denuncia:', error);
    return sendResponse(res, 500, {}, 'Error al validar la denuncia');
  }
});

module.exports = router;
