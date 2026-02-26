/**
 * Endpoint para marcar una denuncia como NO_ATENDIBLE
 * PATCH /admin/denuncias/:id/no-atendible
 */

const router = require('express').Router();
const Denuncia = require('../../Models/denuncia');
const User = require('../../Models/user');
const { createAndEmitNotification } = require('../../utils/notificationService');
const { sendResponse } = require('../../utils/responseHandler');

router.patch('/:id/no-atendible', async (req, res) => {
  try {
    const { id } = req.params;
    const { razon } = req.body;
    const adminId = req.user?.adminId || req.user?._id;

    // Validar que se proporcione la razón
    if (!razon || razon.trim().length < 20) {
      return sendResponse(res, 400, {}, 'Debe proporcionar una razón detallada (mínimo 20 caracteres)');
    }

    // Buscar la denuncia
    const denuncia = await Denuncia.findById(id);
    
    if (!denuncia) {
      return sendResponse(res, 404, {}, 'Denuncia no encontrada');
    }

    if (denuncia.isDeleted) {
      return sendResponse(res, 400, {}, 'Esta denuncia ha sido eliminada');
    }

    // Permitir marcar como NO_ATENDIBLE desde REVISION o VERIFICADA_NO_ATENDIDA
    if (!['REVISION', 'VERIFICADA_NO_ATENDIDA'].includes(denuncia.estado)) {
      return sendResponse(res, 400, {}, 'Solo se pueden marcar como no atendibles denuncias en REVISION o VERIFICADA_NO_ATENDIDA');
    }

    // Actualizar estado a NO_ATENDIBLE y guardar razón
    denuncia.estado = 'NO_ATENDIBLE';
    denuncia.razonNoAtendible = razon.trim();
    
    // Agregar entrada al historial
    denuncia.historialEstados.push({
      estado: 'NO_ATENDIBLE',
      fecha: new Date(),
      adminResponsable: adminId,
      observaciones: `Marcada como no atendible. Razón: ${razon.trim()}`
    });

    await denuncia.save();

    // Obtener datos del usuario para notificación
    const usuario = await User.findById(denuncia.idDenunciante);

    // Crear y emitir notificación al usuario
    if (usuario) {
      await createAndEmitNotification({
        userId: usuario._id,
        userModel: 'User',
        type: 'denuncia_no_atendible',
        title: 'Información Sobre Su Denuncia',
        message: `Su denuncia "${denuncia.tituloDenuncia}" no puede ser atendida en este momento`,
        data: {
          denunciaId: denuncia._id,
          titulo: denuncia.tituloDenuncia,
          razon: razon.trim()
        },
        userEmail: usuario.email,
        emailData: {
          titulo: denuncia.tituloDenuncia,
          razon: razon.trim(),
          categoria: denuncia.categoria,
          denunciaId: denuncia._id
        }
      });
    }

    console.log(`✓ Denuncia ${id} marcada como NO_ATENDIBLE por admin ${adminId}`);

    return sendResponse(res, 200, { denuncia }, 'Denuncia marcada como no atendible correctamente');

  } catch (error) {
    console.error('Error marcando denuncia como no atendible:', error);
    return sendResponse(res, 500, {}, 'Error al marcar la denuncia');
  }
});

module.exports = router;
