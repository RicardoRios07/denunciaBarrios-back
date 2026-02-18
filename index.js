const express = require('express');
const connMongo = require('./src/Config/Database/configMongo');
const ensureDBConnection = require('./src/Middleware/ensure-db-connection');
const swaggerUi = require('swagger-ui-express');
const morgan = require('morgan');
const swaggerJsdoc = require('swagger-jsdoc');
require('dotenv').config();
const app = express();
const cors = require('cors');
const helmet = require('helmet'); 

connMongo.mongoose;

const corsOptions = {
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'auth-token', 'auth-admin'],
    exposedHeaders: ['Content-Length', 'X-Requested-With'],
    optionsSuccessStatus: 200
};

// Middleware para asegurar conexión DB en serverless
app.use(ensureDBConnection);

// Middleware para agregar encabezados de seguridad
app.use((req, res, next) => {

    res.setHeader('Content-Security-Policy', "default-src 'self';");
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'no-referrer');
    res.setHeader('Permissions-Policy', 'geolocation=(self), microphone=()');
    next();
});

morgan.token('custom', function (req, res) {
    return `IP: ${req.ip}, Method: ${req.method}, URL: ${req.originalUrl}, Status: ${res.statusCode}`;
});

app.use(morgan(':custom'));

app.use(cors(corsOptions));

// Capturar body
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Importar rutas
const AuthRoutes = require('./src/Routes/authRoutes');
const denunciaRoutes = require('./src/Routes/denunciaRoutes');
const adminRoutes = require('./src/Routes/adminRoutes');
const verifyToken = require('./src/Middleware/validate-token');
const verifyAdminToken = require('./src/Middleware/verifyAdminToken');
const userRoutes = require('./src/Routes/userRoutes');
const dashboardRoutes = require ('./src/Routes/dashboardRoutes');

// Ruta de autenticación
app.use('/auth', AuthRoutes);
app.use('/admin', adminRoutes);

// Middleware para verificar el token en las rutas protegidas
app.use('/denuncias', verifyToken);
app.use('/user', verifyToken);

// Ruta por defecto
app.get('/', (req, res) => {
    res.json({
        estado: true,
        mensaje: 'Bienvenid@, inicia sesión o regístrate por favor =)',
    });
});

// Ruta protegida 
app.use('/admin/dashboard', dashboardRoutes);
app.use('/denuncias', denunciaRoutes);
app.use('/user', userRoutes);

// Configuración de Swagger
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Denuncias en Barrios',
            version: '1.0.0',
            description: 'API REST completa para la gestión de denuncias ciudadanas en barrios. Incluye autenticación, gestión de usuarios, administración de denuncias, panel de administración y dashboard con estadísticas.',
            contact: {
                name: 'Soporte API',
                email: 'soporte@denunciabarrios.com'
            },
            license: {
                name: 'MIT',
                url: 'https://opensource.org/licenses/MIT'
            }
        },
        servers: [
            {
                url: `http://${process.env.IP_SERVER}:${process.env.PORT}`,
                description: 'Servidor de desarrollo'
            },
        ],
        tags: [
            {
                name: 'Auth',
                description: 'Endpoints de autenticación y gestión de cuentas de usuario'
            },
            {
                name: 'Denuncias',
                description: 'Endpoints para la gestión de denuncias ciudadanas'
            },
            {
                name: 'Administrador',
                description: 'Endpoints exclusivos para administradores del sistema'
            },
            {
                name: 'Usuario',
                description: 'Endpoints para la gestión de perfil de usuario'
            },
            {
                name: 'Dashboard',
                description: 'Endpoints para estadísticas y métricas del sistema'
            }
        ]
    },
    apis: [
        './src/swagger/*.js',
        './src/Routes/Authentication/*.js', 
        './src/Routes/denunciaRoutes/*.js', 
        './src/Routes/adminRoutes/*.js',
        './src/Routes/userRoutes/*.js',
        './src/Controllers/*.js',
        './src/Models/*.js'
    ],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Ruta para UI de Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'API Denuncias Barrios - Documentación'
}));

// Ruta para exportar el archivo openapi.json
app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
});

// Iniciar servidor
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Servidor en ejecución en el puerto: ${PORT}`);
});
