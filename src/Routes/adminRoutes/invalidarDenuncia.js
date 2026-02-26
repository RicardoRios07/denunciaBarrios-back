/**
 * Endpoint para invalidar una denuncia
 * PATCH /admin/denuncias/:id/invalida
 */

const router = require('express').Router();
const Denuncia = require('../../Models/denuncia');
const User = require('../../Models/user');
const { createAndEmitNotification } = require('../../utils/notificationService');
const { sendResponse } = require('../../utils/responseHandler');

router.patch('/:id/invalida', async (req, res) => {
  try {
    const { id } = req.params;
    const { motivo } = req.body;
    const adminId = req.user?.adminId || req.user?._id;

    // Validar que se proporcione el motivo
    if (!motivo || motivo.trim().length < 10) {
      return sendResponse(res, 400, {}, 'Debe proporcionar un motivo válido (mínimo 10 caracteres)');
    }

    // Buscar la denuncia
    const denuncia = await Denuncia.findById(id);
    
    if (!denuncia) {
      return sendResponse(res, 404, {}, 'Denuncia no encontrada');
    }

    if (denuncia.isDeleted) {
      return sendResponse(res, 400, {}, 'Esta denuncia ha sido eliminada');
    }

    if (denuncia.estado !== 'REVISION') {
      return sendResponse(res, 400, {}, 'Solo se pueden invalidar denuncias en estado REVISION');
    }

    // Actualizar estado a INVALIDA y guardar motivo
    denuncia.estado = 'INVALIDA';
    denuncia.motivoInvalida = motivo.trim();
    
    // Agregar entrada al historial
    denuncia.historialEstados.push({
      estado: 'INVALIDA',
      fecha: new Date(),
      adminResponsable: adminId,
      observaciones: `Denuncia invalidada. Motivo: ${motivo.trim()}`
    });

    await denuncia.save();

    // Obtener datos del usuario para notificación
    const usuario = await User.findById(denuncia.idDenunciante);

    // Crear y emitir notificación al usuario
    if (usuario) {
      await createAndEmitNotification({
        userId: usuario._id,
        userModel: 'User',
        type: 'denuncia_invalida',
        title: 'Denuncia No Válida',
        message: `Su denuncia "${denuncia.tituloDenuncia}" ha sido marcada como no válida`,
        data: {
          denunciaId: denuncia._id,
          titulo: denuncia.tituloDenuncia,
          motivo: motivo.trim()
        },
        userEmail: usuario.email,
        emailData: {
          titulo: denuncia.tituloDenuncia,
          motivo: motivo.trim(),
          categoria: denuncia.categoria,
          denunciaId: denuncia._id
        }
      });
    }

    console.log(`✓ Denuncia ${id} invalidada por admin ${adminId}`);

    return sendResponse(res, 200, { denuncia }, 'Denuncia invalidada correctamente');

  } catch (error) {
    console.error('Error invalidando denuncia:', error);
    return sendResponse(res, 500, {}, 'Error al invalidar la denuncia');
  }
});

module.exports = router;
