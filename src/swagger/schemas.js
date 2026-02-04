/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *       description: Token JWT de autenticación de usuario
 *     AdminAuth:
 *       type: apiKey
 *       in: header
 *       name: auth-admin
 *       description: Token JWT de autenticación de administrador
 *   
 *   schemas:
 *     StandardResponse:
 *       type: object
 *       properties:
 *         code:
 *           type: integer
 *           description: Código de estado HTTP
 *           example: 200
 *         status:
 *           type: string
 *           description: Estado de la respuesta
 *           example: success
 *         message:
 *           type: string
 *           description: Mensaje descriptivo
 *           example: Operación exitosa
 *         data:
 *           type: object
 *           description: Datos de la respuesta
 *     
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         code:
 *           type: integer
 *           description: Código de error HTTP
 *           example: 400
 *         status:
 *           type: string
 *           description: Estado del error
 *           example: error
 *         message:
 *           type: string
 *           description: Mensaje de error
 *           example: Error en la operación
 *         error:
 *           type: string
 *           description: Detalle del error
 *           example: Campo requerido faltante
 *     
 *     LoginInput:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: Correo electrónico del usuario
 *           example: usuario@example.com
 *         password:
 *           type: string
 *           format: password
 *           description: Contraseña del usuario
 *           example: password123
 *     
 *     LoginResponse:
 *       type: object
 *       properties:
 *         code:
 *           type: integer
 *           example: 200
 *         status:
 *           type: string
 *           example: success
 *         message:
 *           type: string
 *           example: Usuario autenticado exitosamente
 *         data:
 *           type: object
 *           properties:
 *             token:
 *               type: string
 *               description: Token JWT para autenticación
 *               example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *             user:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: 611d4d25db48de5f8c18e4e1
 *                 nombreCompleto:
 *                   type: string
 *                   example: Juan Pérez
 *                 email:
 *                   type: string
 *                   example: usuario@example.com
 *     
 *     RegisterInput:
 *       type: object
 *       required:
 *         - nombreCompleto
 *         - cedula
 *         - numTelefono
 *         - email
 *         - password
 *       properties:
 *         nombreCompleto:
 *           type: string
 *           minLength: 6
 *           maxLength: 255
 *           description: Nombre completo del usuario
 *           example: Juan Pérez García
 *         cedula:
 *           type: string
 *           minLength: 6
 *           maxLength: 10
 *           description: Número de cédula del usuario
 *           example: 1234567890
 *         numTelefono:
 *           type: string
 *           minLength: 6
 *           maxLength: 10
 *           description: Número de teléfono del usuario
 *           example: 0987654321
 *         email:
 *           type: string
 *           format: email
 *           minLength: 6
 *           maxLength: 255
 *           description: Correo electrónico del usuario
 *           example: usuario@example.com
 *         password:
 *           type: string
 *           minLength: 6
 *           maxLength: 1024
 *           description: Contraseña del usuario
 *           example: password123
 *         photo:
 *           type: string
 *           format: binary
 *           description: Foto de perfil del usuario (opcional)
 *     
 *     PasswordRecoveryInput:
 *       type: object
 *       required:
 *         - email
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: Correo electrónico del usuario
 *           example: usuario@example.com
 *     
 *     NewPasswordInput:
 *       type: object
 *       required:
 *         - newPassword
 *       properties:
 *         newPassword:
 *           type: string
 *           minLength: 6
 *           description: Nueva contraseña del usuario
 *           example: newPassword123
 *     
 *     Ubicacion:
 *       type: object
 *       required:
 *         - type
 *         - coordinates
 *       properties:
 *         type:
 *           type: string
 *           enum: [Point]
 *           description: Tipo de ubicación GeoJSON
 *           example: Point
 *         coordinates:
 *           type: array
 *           items:
 *             type: number
 *           minItems: 2
 *           maxItems: 2
 *           description: Coordenadas [longitud, latitud]
 *           example: [-78.4678, -0.1807]
 *     
 *     DenunciaInput:
 *       type: object
 *       required:
 *         - tituloDenuncia
 *         - descripcion
 *         - evidencia
 *         - ubicacion
 *         - categoria
 *       properties:
 *         tituloDenuncia:
 *           type: string
 *           description: Título de la denuncia
 *           example: Fuga de agua en la calle principal
 *         descripcion:
 *           type: string
 *           description: Descripción detallada de la denuncia
 *           example: Existe una fuga de agua potable en la calle principal desde hace 3 días
 *         evidencia:
 *           type: string
 *           format: binary
 *           description: Imagen de evidencia
 *         ubicacion:
 *           type: string
 *           description: Ubicación en formato JSON stringificado con type y coordinates
 *           example: '{"type":"Point","coordinates":[-78.4678,-0.1807]}'
 *         categoria:
 *           type: string
 *           enum:
 *             - Agua Potable, Alcantarillado Sanitario, Alcantarillado Pluvial
 *             - Recolección de Desechos y Saneamiento Ambiental
 *             - Movilidad Urbana: Bacheo de Calles, Frecuencias, Obstrucciones de aceras, etc.
 *             - Obstrucción de vías por construcciones, ornato, permisos de construcción
 *           description: Categoría de la denuncia
 *           example: Agua Potable, Alcantarillado Sanitario, Alcantarillado Pluvial
 *     
 *     DenunciaResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/Denuncia'
 *         - type: object
 *           properties:
 *             _id:
 *               type: string
 *               description: ID de la denuncia
 *               example: 611d4d25db48de5f8c18e4e1
 *     
 *     EstadoDenunciaInput:
 *       type: object
 *       required:
 *         - estado
 *       properties:
 *         estado:
 *           type: string
 *           enum: [En revisión, En proceso, Atendida]
 *           description: Nuevo estado de la denuncia
 *           example: En proceso
 *     
 *     AdminInput:
 *       type: object
 *       required:
 *         - nombreCompleto
 *         - email
 *         - password
 *       properties:
 *         nombreCompleto:
 *           type: string
 *           description: Nombre completo del administrador
 *           example: Admin Principal
 *         email:
 *           type: string
 *           format: email
 *           description: Correo electrónico del administrador
 *           example: admin@example.com
 *         password:
 *           type: string
 *           minLength: 6
 *           description: Contraseña del administrador
 *           example: adminPassword123
 *     
 *     UserStatusInput:
 *       type: object
 *       required:
 *         - isBlocked
 *       properties:
 *         isBlocked:
 *           type: boolean
 *           description: Estado de bloqueo del usuario
 *           example: true
 *     
 *     DashboardStats:
 *       type: object
 *       properties:
 *         totalDenuncias:
 *           type: integer
 *           description: Total de denuncias en el sistema
 *           example: 150
 *         denunciasEnRevision:
 *           type: integer
 *           description: Denuncias en estado de revisión
 *           example: 45
 *         denunciasEnProceso:
 *           type: integer
 *           description: Denuncias en proceso de atención
 *           example: 65
 *         denunciasAtendidas:
 *           type: integer
 *           description: Denuncias atendidas
 *           example: 40
 *         totalUsuarios:
 *           type: integer
 *           description: Total de usuarios registrados
 *           example: 320
 *         usuariosActivos:
 *           type: integer
 *           description: Usuarios activos (no bloqueados)
 *           example: 300
 *         usuariosBloqueados:
 *           type: integer
 *           description: Usuarios bloqueados
 *           example: 20
 *         denunciasPorCategoria:
 *           type: object
 *           description: Distribución de denuncias por categoría
 *           additionalProperties:
 *             type: integer
 */

module.exports = {};
