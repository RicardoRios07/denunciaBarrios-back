const router = require('express').Router();
const PersonalMunicipal = require('../../Models/personalMunicipal');
const verifyAdminToken = require('../../Middleware/verifyAdminToken');
const { sendResponse } = require('../../utils/responseHandler');

/**
 * @swagger
 * /admin/personal:
 *   post:
 *     summary: Registrar nuevo personal municipal
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
 *               nombreCompleto:
 *                 type: string
 *               cedula:
 *                 type: string
 *               cargo:
 *                 type: string
 *               departamento:
 *                 type: string
 *                 enum: [Agua Potable y Alcantarillado, Gestión Ambiental, Obras Públicas y Movilidad, Control Urbano y Construcciones]
 *               especialidad:
 *                 type: string
 *               telefono:
 *                 type: string
 *               email:
 *                 type: string
 *             required:
 *               - nombreCompleto
 *               - cedula
 *               - cargo
 *               - departamento
 *               - especialidad
 *     responses:
 *       201:
 *         description: Personal registrado exitosamente
 *       400:
 *         description: Error en parámetros o personal ya existe
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */

router.post('/', verifyAdminToken, async (req, res) => {
    try {
        const { nombreCompleto, cedula, cargo, departamento, especialidad, telefono, email } = req.body;

        if (!nombreCompleto || !cedula || !cargo || !departamento || !especialidad) {
            return sendResponse(res, 400, {}, 'Faltan campos requeridos');
        }

        // Verificar si ya existe personal con esa cédula
        const personalExistente = await PersonalMunicipal.findOne({ cedula });
        if (personalExistente) {
            return sendResponse(res, 400, {}, 'Ya existe personal registrado con esta cédula');
        }

        const nuevoPersonal = new PersonalMunicipal({
            nombreCompleto,
            cedula,
            cargo,
            departamento,
            especialidad,
            telefono,
            email
        });

        await nuevoPersonal.save();

        return sendResponse(res, 201, nuevoPersonal, 'Personal registrado exitosamente');
    } catch (error) {
        console.error('Error al registrar personal:', error);
        return sendResponse(res, 500, {}, 'Error del servidor al registrar personal');
    }
});

/**
 * @swagger
 * /admin/personal:
 *   get:
 *     summary: Obtener lista de personal municipal
 *     tags:
 *       - Administrador
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: departamento
 *         schema:
 *           type: string
 *         description: Filtrar por departamento
 *       - in: query
 *         name: estado
 *         schema:
 *           type: string
 *         description: Filtrar por estado
 *       - in: query
 *         name: disponible
 *         schema:
 *           type: boolean
 *         description: Filtrar solo personal activo con pocas asignaciones
 *     responses:
 *       200:
 *         description: Lista de personal obtenida exitosamente
 *       401:
 *         description: No autorizado
 *       500:
 *         description: Error del servidor
 */

router.get('/', verifyAdminToken, async (req, res) => {
    try {
        const { departamento, estado, disponible } = req.query;
        
        let filtro = { isDeleted: false };

        if (departamento) {
            filtro.departamento = departamento;
        }

        if (estado) {
            filtro.estado = estado;
        }

        let personal = await PersonalMunicipal.find(filtro)
            .populate('denunciasAsignadas', 'tituloDenuncia estado categoria')
            .sort({ fechaIngreso: -1 });

        // Si se solicita solo personal disponible
        if (disponible === 'true') {
            personal = personal.filter(p => 
                p.estado === 'Activo' && 
                p.denunciasAsignadas.filter(d => d.estado !== 'Atendida').length < 5
            );
        }

        return sendResponse(res, 200, personal, 'Personal obtenido exitosamente');
    } catch (error) {
        console.error('Error al obtener personal:', error);
        return sendResponse(res, 500, {}, 'Error del servidor al obtener personal');
    }
});

/**
 * @swagger
 * /admin/personal/{id}:
 *   get:
 *     summary: Obtener detalles de un personal específico
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
 *         description: ID del personal
 *     responses:
 *       200:
 *         description: Detalles del personal obtenidos exitosamente
 *       404:
 *         description: Personal no encontrado
 *       500:
 *         description: Error del servidor
 */

router.get('/:id', verifyAdminToken, async (req, res) => {
    try {
        const { id } = req.params;

        const personal = await PersonalMunicipal.findById(id)
            .populate({
                path: 'denunciasAsignadas',
                select: 'tituloDenuncia estado categoria fechaHora ubicacion',
                match: { isDeleted: false }
            });

        if (!personal) {
            return sendResponse(res, 404, {}, 'Personal no encontrado');
        }

        return sendResponse(res, 200, personal, 'Detalles del personal obtenidos exitosamente');
    } catch (error) {
        console.error('Error al obtener detalles del personal:', error);
        return sendResponse(res, 500, {}, 'Error del servidor al obtener detalles');
    }
});

/**
 * @swagger
 * /admin/personal/{id}:
 *   put:
 *     summary: Actualizar información de personal
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cargo:
 *                 type: string
 *               departamento:
 *                 type: string
 *               especialidad:
 *                 type: string
 *               telefono:
 *                 type: string
 *               email:
 *                 type: string
 *               estado:
 *                 type: string
 *     responses:
 *       200:
 *         description: Personal actualizado exitosamente
 *       404:
 *         description: Personal no encontrado
 *       500:
 *         description: Error del servidor
 */

router.put('/:id', verifyAdminToken, async (req, res) => {
    try {
        const { id } = req.params;
        const { cargo, departamento, especialidad, telefono, email, estado } = req.body;

        const actualizacion = {};
        if (cargo) actualizacion.cargo = cargo;
        if (departamento) actualizacion.departamento = departamento;
        if (especialidad) actualizacion.especialidad = especialidad;
        if (telefono) actualizacion.telefono = telefono;
        if (email) actualizacion.email = email;
        if (estado) actualizacion.estado = estado;

        const personalActualizado = await PersonalMunicipal.findByIdAndUpdate(
            id,
            actualizacion,
            { new: true, runValidators: true }
        );

        if (!personalActualizado) {
            return sendResponse(res, 404, {}, 'Personal no encontrado');
        }

        return sendResponse(res, 200, personalActualizado, 'Personal actualizado exitosamente');
    } catch (error) {
        console.error('Error al actualizar personal:', error);
        return sendResponse(res, 500, {}, 'Error del servidor al actualizar personal');
    }
});

/**
 * @swagger
 * /admin/personal/{id}:
 *   delete:
 *     summary: Eliminar (desactivar) personal municipal
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
 *     responses:
 *       200:
 *         description: Personal eliminado exitosamente
 *       404:
 *         description: Personal no encontrado
 *       500:
 *         description: Error del servidor
 */

router.delete('/:id', verifyAdminToken, async (req, res) => {
    try {
        const { id } = req.params;

        const personal = await PersonalMunicipal.findByIdAndUpdate(
            id,
            { isDeleted: true, estado: 'Inactivo' },
            { new: true }
        );

        if (!personal) {
            return sendResponse(res, 404, {}, 'Personal no encontrado');
        }

        return sendResponse(res, 200, {}, 'Personal eliminado exitosamente');
    } catch (error) {
        console.error('Error al eliminar personal:', error);
        return sendResponse(res, 500, {}, 'Error del servidor al eliminar personal');
    }
});

module.exports = router;
