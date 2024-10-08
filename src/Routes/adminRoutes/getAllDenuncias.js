const router = require('express').Router();
const Denuncia = require('../../Models/denuncia');
const verifyAdminToken = require('../../Middleware/verifyAdminToken');
const { sendResponse } = require('../../utils/responseHandler');

/**
 * @swagger
 * tags:
 *   - name: Administrador
 *     description: Endpoints para administradores
 * 
 * /admin/getAllDenuncias:
 *   post:
 *     summary: Ver todas las denuncias.
 *     tags:
 *       - Administrador
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de todas las denuncias obtenida exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 message:
 *                   type: string
 *                   example: "Lista de todas las denuncias obtenida exitosamente."
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Denuncia'
 *       401:
 *         description: No se proporcionó un token de autenticación válido.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 401
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   example: "Acceso no autorizado."
 *                 data:
 *                   type: object
 *       500:
 *         description: Error del servidor al obtener las denuncias.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 500
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   example: "Error del servidor al obtener las denuncias."
 *                 data:
 *                   type: object
 */

router.post('/', verifyAdminToken, async (req, res) => {
    try {
        const denuncias = await Denuncia.find();
        return sendResponse(res, 200, denuncias, 'Lista de todas las denuncias obtenida exitosamente.')
    } catch (error) {
        console.error('Error al obtener todas las denuncias:', error);
        return sendResponse(res, 500, {}, 'Error del servidor al obtener las denuncias.')
    }
});

module.exports = router;