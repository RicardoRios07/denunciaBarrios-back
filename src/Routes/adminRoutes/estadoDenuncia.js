const router = require('express').Router();
const Denuncia = require('../../Models/denuncia');
const verifyAdminToken = require('../../Middleware/verifyAdminToken');

/**
 * @swagger
 * tags:
 *   name: Administrador
 *   description: Endpoints para administradores
 */

/**
 * @swagger
 * /admin/modificarEstadoDenuncia:
 *   post:
 *     summary: Modificar el estado de una denuncia por su ID.
 *     tags: [Administrador]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               _id:
 *                 type: string
 *                 description: ID de la denuncia a modificar.
 *                 example: 6123456789abcdef12345678
 *               estado:
 *                 type: string
 *                 description: Nuevo estado de la denuncia.
 *                 example: En proceso de solución
 *             required:
 *               - _id
 *               - estado
 *     responses:
 *       200:
 *         description: Estado de la denuncia modificado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Estado de la denuncia modificado exitosamente.
 *       400:
 *         description: Error en la solicitud del cliente o denuncia no encontrada.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Denuncia no encontrada.
 *       401:
 *         description: No se proporcionó un token de autenticación válido.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Acceso no autorizado.
 *       500:
 *         description: Error del servidor al modificar el estado de la denuncia.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Error del servidor al modificar el estado de la denuncia.
 */

router.post('/', verifyAdminToken,async (req, res) => {
    try {
        const { _id, estado } = req.body;

        // Validar que se proporcione el ID y el nuevo estado de la denuncia
        if (!_id || !estado) {
            return res.status(400).json({ error: 'Se deben proporcionar el ID y el nuevo estado de la denuncia.' });
        }

        // Buscar y actualizar el estado de la denuncia por su ID
        const denunciaActualizada = await Denuncia.findByIdAndUpdate(_id, { estado }, { new: true });

        if (!denunciaActualizada) {
            return res.status(400).json({ error: 'Denuncia no encontrada.' });
        }

        return res.status(200).json({ message: 'Estado de la denuncia modificado exitosamente.' });
    } catch (error) {
        console.error('Error al modificar el estado de la denuncia:', error);
        return res.status(500).json({ error: 'Error del servidor al modificar el estado de la denuncia.' });
    }
});

module.exports = router;