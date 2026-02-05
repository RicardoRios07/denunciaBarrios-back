const { connectDB } = require('../Config/Database/configMongo');

/**
 * Middleware para asegurar que la conexión a MongoDB esté establecida
 * antes de procesar cualquier request en ambientes serverless
 */
async function ensureDBConnection(req, res, next) {
    try {
        await connectDB();
        next();
    } catch (error) {
        console.error('Error al conectar con la base de datos:', error);
        res.status(503).json({
            code: 503,
            status: 'error',
            message: 'Servicio no disponible - Error de conexión a la base de datos',
            data: {}
        });
    }
}

module.exports = ensureDBConnection;
