const router = require('express').Router();
const Denuncia = require('../../Models/denuncia');
const PersonalMunicipal = require('../../Models/personalMunicipal');
const verifyAdminToken = require('../../Middleware/verifyAdminToken');
const { sendResponse } = require('../../utils/responseHandler');

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

        if (!denunciaId || !personalId) {
            return sendResponse(res, 400, {}, 'Faltan parámetros requeridos: denunciaId y personalId');
        }

        // Verificar que la denuncia exista
        const denuncia = await Denuncia.findById(denunciaId);
        if (!denuncia) {
            return sendResponse(res, 404, {}, 'Denuncia no encontrada');
        }

        // Verificar que el personal exista y esté activo
        const personal = await PersonalMunicipal.findById(personalId);
        if (!personal) {
            return sendResponse(res, 404, {}, 'Personal municipal no encontrado');
        }

        if (personal.estado !== 'Activo') {
            return sendResponse(res, 400, {}, 'El personal no está activo para asignaciones');
        }

        // Asignar personal a la denuncia
        denuncia.personalAsignado = personalId;
        
        // Agregar al historial de estados
        denuncia.historialEstados.push({
            estado: denuncia.estado,
            fecha: new Date(),
            adminResponsable: req.adminId,
            observaciones: observaciones || `Personal asignado: ${personal.nombreCompleto}`
        });

        await denuncia.save();

        // Actualizar el array de denuncias asignadas del personal
        if (!personal.denunciasAsignadas.includes(denunciaId)) {
            personal.denunciasAsignadas.push(denunciaId);
            await personal.save();
        }

        const denunciaPopulada = await Denuncia.findById(denunciaId)
            .populate('personalAsignado', 'nombreCompleto cargo departamento telefono email');

        return sendResponse(res, 200, denunciaPopulada, 'Personal asignado exitosamente');
    } catch (error) {
        console.error('Error al asignar personal:', error);
        return sendResponse(res, 500, {}, 'Error del servidor al asignar personal');
    }
});

module.exports = router;
