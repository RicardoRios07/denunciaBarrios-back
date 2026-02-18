const express = require('express');
const router = express.Router();
const dashboardController = require('../Controllers/dashboardController');
const verifyAdminToken = require('../Middleware/verifyAdminToken');
const validateToken = require('../Middleware/validate-token');

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Endpoints para estadísticas y métricas del sistema
 */

/**
 * @swagger
 * /admin/dashboard/stats:
 *   get:
 *     summary: Obtener todas las estadísticas del dashboard admin
 *     tags: [Dashboard]
 *     security:
 *       - AdminAuth: []
 *     responses:
 *       200:
 *         description: Estadísticas obtenidas correctamente
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.get('/stats', verifyAdminToken, dashboardController.getAdminStats);

/**
 * @swagger
 * /admin/dashboard/userStats:
 *   get:
 *     summary: Obtener estadísticas del dashboard del usuario
 *     tags: [Dashboard]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Estadísticas obtenidas correctamente
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */
router.get('/userStats', validateToken, dashboardController.getUserDashboardStats);

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
router.post('/getUsersCount', verifyAdminToken, dashboardController.getUsersCount);

/**
 * @swagger
 * /admin/dashboard/denunciasCount:
 *   get:
 *     summary: Obtener el conteo total de denuncias
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Conteo de denuncias obtenido correctamente
 *       500:
 *         description: Error del servidor
 */
router.get('/denunciasCount', verifyAdminToken, dashboardController.getDenunciasCount);

/**
 * @swagger
 * /admin/dashboard/denunciasByStatus:
 *   get:
 *     summary: Obtener denuncias agrupadas por estado
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Denuncias por estado obtenidas correctamente
 *       500:
 *         description: Error del servidor
 */
router.get('/denunciasByStatus', verifyAdminToken, dashboardController.getDenunciasByStatus);

/**
 * @swagger
 * /admin/dashboard/denunciasByCategory:
 *   get:
 *     summary: Obtener denuncias agrupadas por categoría
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Denuncias por categoría obtenidas correctamente
 *       500:
 *         description: Error del servidor
 */
router.get('/denunciasByCategory', verifyAdminToken, dashboardController.getDenunciasByCategory);

module.exports = router;