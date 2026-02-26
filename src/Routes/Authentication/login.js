const router = require('express').Router();
const User = require('../../Models/user');
const Admin = require('../../Models/admin');
const PersonalMunicipal = require('../../Models/personalMunicipal');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Joi = require('@hapi/joi');
const { sendResponse } = require('../../utils/responseHandler');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Endpoints para la autenticación y recuperación de contraseña.
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Iniciar sesión de usuario o administrador
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginInput'
 *     responses:
 *       200:
 *         description: Usuario autenticado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StandardResponse'
 *       400:
 *         description: Contraseña no válida
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Usuario bloqueado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     LoginInput:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           minLength: 6
 *           maxLength: 255
 *         password:
 *           type: string
 *           minLength: 6
 *           maxLength: 1024
 *     StandardResponse:
 *       type: object
 *       properties:
 *         code:
 *           type: integer
 *         status:
 *           type: string
 *         message:
 *           type: string
 *         data:
 *           type: object
 *           properties:
 *             token:
 *               type: string
 *             role:
 *               type: string
 *               enum: [user, admin]
 *             user:
 *               type: object
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         code:
 *           type: integer
 *         status:
 *           type: string
 *         message:
 *           type: string
 *         data:
 *           type: object
 */


router.post('/', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Primero buscar en usuarios normales
        let user = await User.findOne({ email });
        let token;

        if (user) {
            // Es un usuario normal
            if (user.isBlocked) {
                return sendResponse(res, 401, {}, 'El usuario está bloqueado. No puede iniciar sesión');
            }

            if (!user.isVerified) {
                return sendResponse(res, 401, {}, 'El usuario no ha verificado su cuenta. No puede iniciar sesión');
            }

            const validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword) {
                return sendResponse(res, 400, {}, 'Correo o contraseña incorrectos.');
            }

            const tokenExpirationSeconds = 3600; 
            token = jwt.sign(
                { _id: user._id },
                process.env.TOKEN_SECRET,
                { expiresIn: tokenExpirationSeconds }
            );

            const expirationDate = new Date(new Date().getTime() + tokenExpirationSeconds * 1000);

            // Preparar datos del usuario (sin contraseña)
            const userData = {
                _id: user._id,
                nombreCompleto: user.nombreCompleto,
                email: user.email,
                cedula: user.cedula,
                numTelefono: user.numTelefono,
                photo: user.photo,
                isVerified: user.isVerified
            };

            return sendResponse(res, 200, { 
                token, 
                role: 'user',
                user: userData,
                expiration: expirationDate.toISOString()
            }, 'Inicio de sesión exitoso');
        }

        // Si no es usuario normal, buscar en personal municipal
        let personal = await PersonalMunicipal.findOne({ email });
        
        if (personal) {
            // Es personal municipal
            if (personal.estado !== 'Activo') {
                return sendResponse(res, 401, {}, 'El personal no está activo. No puede iniciar sesión');
            }

            const validPassword = await bcrypt.compare(password, personal.password || '');
            if (!validPassword) {
                return sendResponse(res, 400, {}, 'Correo o contraseña incorrectos.');
            }

            const tokenExpirationSeconds = 3600;
            token = jwt.sign(
                { 
                    _id: personal._id,
                    role: 'PERSONAL'
                },
                process.env.TOKEN_SECRET,
                { expiresIn: tokenExpirationSeconds }
            );

            const expirationDate = new Date(new Date().getTime() + tokenExpirationSeconds * 1000);

            // Preparar datos del personal (sin contraseña)
            const personalData = {
                _id: personal._id,
                nombreCompleto: personal.nombreCompleto,
                email: personal.email,
                cedula: personal.cedula,
                telefono: personal.telefono,
                cargo: personal.cargo,
                departamento: personal.departamento,
                especialidad: personal.especialidad,
                estado: personal.estado,
                role: 'PERSONAL'
            };

            return sendResponse(res, 200, { 
                token, 
                role: 'personal',
                user: personalData,
                expiration: expirationDate.toISOString()
            }, 'Inicio de sesión exitoso');
        }

        // Si no es usuario normal ni personal, buscar en administradores
        const admin = await Admin.findOne({ email });
        
        if (!admin) {
            return sendResponse(res, 404, {}, 'Correo o contraseña incorrectos.');
        }

        if (admin.isDeleted) {
            return sendResponse(res, 401, {}, 'Usuario no encontrado.');
        }

        if (!admin.isVerified) {
            return sendResponse(res, 401, {}, 'Administrador no verificado.');
        }

        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!isPasswordValid) {
            return sendResponse(res, 400, {}, 'Correo o contraseña incorrectos.');
        }

        // Generar token de administrador
        token = jwt.sign(
            { adminId: admin._id }, 
            process.env.SECRETO_ADMINS, 
            { expiresIn: '1h' }
        );

        const expirationDate = new Date(new Date().getTime() + 3600 * 1000);

        // Preparar datos del admin (sin contraseña)
        const adminData = {
            _id: admin._id,
            nombreCompleto: admin.nombreCompleto,
            email: admin.email,
            isVerified: admin.isVerified
        };

        return sendResponse(res, 200, {
            token,
            role: 'admin',
            user: adminData,
            expiration: expirationDate.toISOString()
        }, 'Inicio de sesión exitoso');

    } catch (error) {
        console.error(error);
        sendResponse(res, 500, {}, 'Error interno del servidor');
    }
});

module.exports = router;