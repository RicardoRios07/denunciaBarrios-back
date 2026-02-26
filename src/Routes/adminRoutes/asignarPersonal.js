const router = require('express').Router();
const Denuncia = require('../../Models/denuncia');
const PersonalMunicipal = require('../../Models/personalMunicipal');
const User = require('../../Models/user');
const verifyAdminToken = require('../../Middleware/verifyAdminToken');
const { sendResponse } = require('../../utils/responseHandler');
const { createAndEmitNotification } = require('../../utils/notificationService');

/**
 * @swagger
 * /admin/asignarPersonal:
 *   post:
 *     summary: Asignar personal municipal a una denuncia
 *     tags:
 *       - Administrador
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               denunciaId:
 *                 type: string
 *                 description: ID de la denuncia
 *                 example: 6123456789abcdef12345678
 *               personalId:
 *                 type: string
 *                 description: ID del personal municipal
 *                 example: 6123456789abcdef12345679
 *               observaciones:
 *                 type: string
 *                 description: Observaciones sobre la asignación
 *                 example: Personal asignado para inspección inicial
 *             required:
 *               - denunciaId
 *               - personalId
 *     responses:
 *       200:
 *         description: Personal asignado exitosamente
 *       400:
 *         description: Error en parámetros o no encontrado
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */

router.post('/', verifyAdminToken, async (req, res) => {
    try {
        const { denunciaId, personalId, observaciones } = req.body;
        const adminId = req.adminId;

        if (!denunciaId || !personalId) {
            return sendResponse(res, 400, {}, 'Faltan parámetros requeridos: denunciaId y personalId');
        }

        // Verificar que la denuncia exista
        const denuncia = await Denuncia.findById(denunciaId);
        if (!denuncia) {
            return sendResponse(res, 404, {}, 'Denuncia no encontrada');
        }

        if (denuncia.isDeleted) {
            return sendResponse(res, 400, {}, 'Esta denuncia ha sido eliminada');
        }

        // Validar que la denuncia esté en estado válido para asignación
        if (!['REVISION', 'VERIFICADA_NO_ATENDIDA'].includes(denuncia.estado)) {
            return sendResponse(res, 400, {}, 'Solo se pueden asignar denuncias en REVISION o VERIFICADA_NO_ATENDIDA');
        }

        // Verificar que el personal exista y esté activo
        const personal = await PersonalMunicipal.findById(personalId);
        if (!personal) {
            return sendResponse(res, 404, {}, 'Personal municipal no encontrado');
        }

        if (personal.estado !== 'Activo') {
            return sendResponse(res, 400, {}, 'El personal no está activo para asignaciones');
        }

        // Si está en REVISION, auto-validar primero
        if (denuncia.estado === 'REVISION') {
            denuncia.estado = 'VERIFICADA_NO_ATENDIDA';
            denuncia.historialEstados.push({
                estado: 'VERIFICADA_NO_ATENDIDA',
                fecha: new Date(),
                adminResponsable: adminId,
                observaciones: 'Validada automáticamente al asignar personal'
            });
        }

        // Asignar personal a la denuncia (usar assigneeId en vez de personalAsignado)
        denuncia.assigneeId = personalId;
        
        // Agregar al historial de estados
        denuncia.historialEstados.push({
            estado: denuncia.estado,
            fecha: new Date(),
            adminResponsable: adminId,
            observaciones: observaciones || `Personal asignado: ${personal.nombreCompleto} - ${personal.departamento}`
        });

        await denuncia.save();

        // Actualizar el array de denuncias asignadas del personal
        if (!personal.denunciasAsignadas.includes(denunciaId)) {
            personal.denunciasAsignadas.push(denunciaId);
            await personal.save();
        }

        // Obtener datos del usuario creador
        const usuario = await User.findById(denuncia.idDenunciante);

        // Notificar al personal asignado
        if (personal.email) {
            await createAndEmitNotification({
                userId: personal._id,
                userModel: 'PersonalMunicipal',
                type: 'denuncia_asignada',
                title: 'Nueva Denuncia Asignada',
                message: `Se le ha asignado la denuncia: ${denuncia.tituloDenuncia}`,
                data: {
                    denunciaId: denuncia._id,
                    titulo: denuncia.tituloDenuncia,
                    categoria: denuncia.categoria
                },
                userEmail: personal.email,
                emailData: {
                    titulo: denuncia.tituloDenuncia,
                    categoria: denuncia.categoria,
                    denunciaId: denuncia._id
                }
            });
        }

        // Notificar al usuario creador
        if (usuario) {
            await createAndEmitNotification({
                userId: usuario._id,
                userModel: 'User',
                type: 'denuncia_asignada',
                title: 'Personal Asignado a Su Denuncia',
                message: `Su denuncia "${denuncia.tituloDenuncia}" ha sido asignada a personal especializado`,
                data: {
                    denunciaId: denuncia._id,
                    titulo: denuncia.tituloDenuncia,
                    personalNombre: personal.nombreCompleto,
                    departamento: personal.departamento
                },
                userEmail: usuario.email,
                emailData: {
                    titulo: denuncia.tituloDenuncia,
                    categoria: denuncia.categoria,
                    personalNombre: personal.nombreCompleto,
                    departamento: personal.departamento,
                    denunciaId: denuncia._id
                }
            });
        }

        console.log(`✓ Denuncia ${denunciaId} asignada a personal ${personalId} por admin ${adminId}`);

        const denunciaPopulada = await Denuncia.findById(denunciaId)
            .populate('assigneeId', 'nombreCompleto cargo departamento telefono email');

        return sendResponse(res, 200, denunciaPopulada, 'Personal asignado exitosamente');
    } catch (error) {
        console.error('Error al asignar personal:', error);
        return sendResponse(res, 500, {}, 'Error del servidor al asignar personal');
    }
});

module.exports = router;
