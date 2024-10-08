const router = require('express').Router();
const Admin = require('../../Models/admin');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { sendResponse } = require('../../utils/responseHandler');

/**
 * @swagger
 * tags:
 *   - name: Administrador
 *     description: Endpoints para administradores
 * 
 * /admin/loginAdmin:
 *   post:
 *     summary: Inicia sesión como administrador.
 *     tags:
 *       - Administrador
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Dirección de correo electrónico del administrador.
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Contraseña del administrador.
 *             example:
 *               email: admin@example.com
 *               password: password123
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso. Se proporciona el token de autenticación.
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
 *                   example: "Inicio de sesión exitoso."
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                       description: Token de autenticación del administrador.
 *       401:
 *         description: Credenciales inválidas.
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
 *                   example: "Credenciales inválidas."
 *                 data:
 *                   type: object
 *       500:
 *         description: Error del servidor al autenticar al administrador.
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
 *                   example: "Error del servidor al autenticar al administrador."
 *                 data:
 *                   type: object
 */

router.post('/', async (req, res) => {
    const { email, password } = req.body;

    try {
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return sendResponse(res, 401, {}, 'Administrador no encontrado.')
        }

        if (admin.isDeleted) {
            return sendResponse(res, 401, {}, 'Administrador no encontrado.' )
        }

        if (!admin.isVerified) {
            return sendResponse(res, 401, {}, 'Administrador no verificado.')
        }

        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!isPasswordValid) {
            return sendResponse(res, 401, {}, 'Credenciales inválidas.')
        }

        const token = jwt.sign({ adminId: admin._id }, process.env.SECRETO_ADMINS, { expiresIn: '1h' });

        sendResponse(res, 200, {token}, 'Inicio de sesión exitoso.')
    } catch (error) {
        console.error('Error al autenticar al administrador:', error);
        sendResponse(res, 500, {}, 'Error del servidor al autenticar al administrador.')
    }
});

module.exports = router;
