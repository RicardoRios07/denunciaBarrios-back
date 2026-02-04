const express = require('express');
const router = express.Router();
const dashboardController = require('../Controllers/dashboardController');

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Endpoints para estadísticas y métricas del sistema
 */

/**
 * @swagger
 * /admin/dashboard/getUsersCount:
 *   post:
 *     summary: Obtener el conteo total de usuarios registrados
 *     tags: [Dashboard]
 *     security:
 *       - AdminAuth: []
 *     responses:
 *       200:
 *         description: Conteo de usuarios obtenido correctamente
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
 *                   example: Número de usuarios obtenido correctamente.
 *                 data:
 *                   type: object
 *                   properties:
 *                     count:
 *                       type: integer
 *                       example: 150
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/getUsersCount', dashboardController.getUsersCount);

module.exports = router;