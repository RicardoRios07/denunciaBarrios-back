/**
 * PATCH /personal/denuncias/:id/en-proceso
 * Cambiar estado de denuncia a EN_PROCESO (iniciar atención)
 */

const router = require('express').Router();
const Denuncia = require('../../Models/denuncia');
const User = require('../../Models/user');
const PersonalMunicipal = require('../../Models/personalMunicipal');
const { createAndEmitNotification } = require('../../utils/notificationService');
const { sendResponse } = require('../../utils/responseHandler');

router.patch('/:id/en-proceso', async (req, res) => {
  try {
    const { id } = req.params;
    const personalId = req.userId;

    // Buscar la denuncia
    const denuncia = await Denuncia.findById(id);

    if (!denuncia) {
      return sendResponse(res, 404, {}, 'Denuncia no encontrada');
    }

    if (denuncia.isDeleted) {
      return sendResponse(res, 400, {}, 'Esta denuncia ha sido eliminada');
    }

    // Verificar que la denuncia esté asignada al personal autenticado
    if (!denuncia.assigneeId || denuncia.assigneeId.toString() !== personalId) {
      return sendResponse(res, 403, {}, 'No tiene permisos para modificar esta denuncia');
    }

    // Verificar que esté en estado VERIFICADA_NO_ATENDIDA
    if (denuncia.estado !== 'VERIFICADA_NO_ATENDIDA') {
      return sendResponse(res, 400, {}, 'Solo se pueden iniciar denuncias en estado VERIFICADA_NO_ATENDIDA');
    }

    // Obtener datos del personal
    const personal = await PersonalMunicipal.findById(personalId);

    // Cambiar estado a EN_PROCESO
    denuncia.estado = 'EN_PROCESO';
    
    // Agregar al historial
    denuncia.historialEstados.push({
      estado: 'EN_PROCESO',
      fecha: new Date(),
      adminResponsable: personalId, // Aunque no es admin, guardamos el ID del personal
      observaciones: `Atención iniciada por ${personal.nombreCompleto}`
    });

    await denuncia.save();

    // Obtener datos del usuario creador
    const usuario = await User.findById(denuncia.idDenunciante);

    // Notificar al usuario
    if (usuario) {
      await createAndEmitNotification({
        userId: usuario._id,
        userModel: 'User',
        type: 'denuncia_en_proceso',
        title: 'Atención Iniciada',
        message: `La atención de su denuncia "${denuncia.tituloDenuncia}" ha sido iniciada`,
        data: {
          denunciaId: denuncia._id,
          titulo: denuncia.tituloDenuncia,
          personalNombre: personal.nombreCompleto
        },
        userEmail: usuario.email,
        emailData: {
          titulo: denuncia.tituloDenuncia,
          personalNombre: personal.nombreCompleto,
          denunciaId: denuncia._id
        }
      });
    }

    console.log(`✓ Denuncia ${id} marcada como EN_PROCESO por personal ${personalId}`);

    return sendResponse(res, 200, { denuncia }, 'Denuncia marcada como en proceso');

  } catch (error) {
    console.error('Error al cambiar estado a EN_PROCESO:', error);
    return sendResponse(res, 500, {}, 'Error al cambiar estado de la denuncia');
  }
});

module.exports = router;
