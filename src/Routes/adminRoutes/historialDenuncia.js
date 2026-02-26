const router = require('express').Router();
const Denuncia = require('../../Models/denuncia');
const verifyAdminToken = require('../../Middleware/verifyAdminToken');
const { sendResponse } = require('../../utils/responseHandler');

/**
 * @swagger
 * /admin/historialDenuncia/{id}:
 *   get:
 *     summary: Obtener historial completo de una denuncia
 *     tags:
 *       - Administrador
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la denuncia
 *     responses:
 *       200:
 *         description: Historial obtenido exitosamente
 *       404:
 *         description: Denuncia no encontrada
 *       500:
 *         description: Error del servidor
 */

router.get('/:id', verifyAdminToken, async (req, res) => {
    try {
        const { id } = req.params;

        const denuncia = await Denuncia.findById(id)
            .populate('idDenunciante', 'nombreCompleto email telefono')
            .populate('assigneeId', 'nombreCompleto cargo departamento telefono email')
            .populate('historialEstados.adminResponsable', 'nombreCompleto email');

        if (!denuncia) {
            return sendResponse(res, 404, {}, 'Denuncia no encontrada');
        }

        const historialCompleto = {
            denuncia: {
                id: denuncia._id,
                titulo: denuncia.tituloDenuncia,
                descripcion: denuncia.descripcion,
                categoria: denuncia.categoria,
                estadoActual: denuncia.estado,
                prioridad: denuncia.prioridad,
                fechaCreacion: denuncia.fechaHora
            },
            denunciante: {
                nombre: denuncia.nombreDenunciante,
                id: denuncia.idDenunciante
            },
            personalAsignado: denuncia.assigneeId ? {
                nombre: denuncia.assigneeId.nombreCompleto,
                cargo: denuncia.assigneeId.cargo,
                departamento: denuncia.assigneeId.departamento,
                contacto: {
                    telefono: denuncia.assigneeId.telefono,
                    email: denuncia.assigneeId.email
                }
            } : null,
            respuesta: denuncia.respuestaPredeterminada ? {
                tipo: denuncia.respuestaPredeterminada.tipo,
                mensaje: denuncia.respuestaPredeterminada.mensaje,
                tiempoEstimado: denuncia.respuestaPredeterminada.tiempoEstimado,
                fechaRespuesta: denuncia.respuestaPredeterminada.fechaRespuesta
            } : null,
            historialEstados: denuncia.historialEstados.map(h => ({
                estado: h.estado,
                fecha: h.fecha,
                admin: h.adminResponsable ? {
                    nombre: h.adminResponsable.nombreCompleto,
                    email: h.adminResponsable.email
                } : null,
                observaciones: h.observaciones
            })),
            ubicacion: denuncia.ubicacion,
            evidencia: denuncia.evidencia
        };

        return sendResponse(res, 200, historialCompleto, 'Historial obtenido exitosamente');
    } catch (error) {
        console.error('Error al obtener historial:', error);
        return sendResponse(res, 500, {}, 'Error del servidor al obtener historial');
    }
});

module.exports = router;
