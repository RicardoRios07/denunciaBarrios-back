const mongoose = require('mongoose');
require('dotenv').config();

// Configuración para ambientes serverless
mongoose.set('strictQuery', false);

// Conexión a Base de datos
const uri = process.env.MONGODB_URI || `mongodb://localhost:27017/barrios`;

// Opciones optimizadas para Vercel/Serverless
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'barrios',
    serverSelectionTimeoutMS: 30000, // 30 segundos para selección de servidor
    socketTimeoutMS: 45000, // 45 segundos para operaciones de socket
    maxPoolSize: 10, // Conexiones máximas en el pool
    minPoolSize: 1, // Conexiones mínimas en el pool
    maxIdleTimeMS: 60000, // Cerrar conexiones inactivas después de 60 segundos
};

// Usar caché de conexión para ambientes serverless
let cachedConnection = null;

async function connectDB() {
    if (cachedConnection && mongoose.connection.readyState === 1) {
        console.log('Usando conexión existente a MongoDB');
        return cachedConnection;
    }

    try {
        cachedConnection = await mongoose.connect(uri, options);
        console.log('Se estableció nueva conexión con la base de datos: barrios');
        return cachedConnection;
    } catch (error) {
        console.error('Error de conexión a la base de datos:', error);
        throw error;
    }
}

// Iniciar conexión
connectDB();

exports.mongoose = mongoose;
exports.connectDB = connectDB;    