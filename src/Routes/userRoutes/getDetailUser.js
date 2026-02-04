const router = require('express').Router();
const verifyToken = require('../../Middleware/validate-token');
const Denuncia = require('../../Models/denuncia');
const User = require('../../Models/user');
const { sendResponse } = require('../../utils/responseHandler');

/**
 * @swagger
 * tags:
 *   name: Usuario
 *   description: Endpoints para la gestión de perfil de usuario
 */

/**
 * @swagger
 * /user/getDetailUser:
 *   get:
 *     summary: Obtener detalles del perfil del usuario autenticado
 *     tags: [Usuario]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Detalles del usuario obtenidos exitosamente
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
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: User retrieved successfully.
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Token de autenticación inválido o ausente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: integer
 *                   example: 404
 *                 status:
 *                   type: string
 *                   example: error
 *                 message:
 *                   type: string
 *                   example: User not found
 *                 data:
 *                   type: object
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

router.get('/', verifyToken, async (req, res) => {
    try {
        const usuarioId = req.user._id; 

        const usuario = await User.findById(usuarioId).select('-password'); 
        if (!usuario) {
            return sendResponse(res, 404, {}, 'User not found');
        }

        return sendResponse(res, 200, usuario, 'User retrieved successfully.');

    } catch (error) {
        console.error('Error retrieving user:', error);
        return sendResponse(res, 500, {}, 'Server error while retrieving user.');
    }
});

module.exports = router;
