const express = require('express');
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const morgan = require('morgan');
const swaggerJsdoc = require('swagger-jsdoc');
require('dotenv').config();
const app = express();
const cors = require('cors');
app.use(cors());
app.use(morgan('dev'));

// Conexión a Base de datos
const uri = `mongodb+srv://${process.env.USERNAME}:${process.env.PASSWORD}@denuncias-back.eugamd3.mongodb.net/barrios`;

mongoose
    .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Se estableció conexión con la base de datos'))
    .catch((e) => console.log('Error de conexión a la base de datos:', e));

// Capturar body
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

// Importar rutas
const authRoutes = require('./src/Routes/ authRoutes');
const homeRoutes = require('./src/Routes/homeRoutes');
const denunciaRoutes = require('./src/Routes/denunciaRoutes');
const verifyToken = require('./src/Routes/validate-token');

// Ruta de autenticación
app.use('/auth', authRoutes);

// Middleware para verificar el token en las rutas protegidas 
//app.use('/', verifyToken);
app.use('/home', verifyToken);
app.use('/denuncia', verifyToken);

// Ruta por defecto
app.get('/', (req, res) => {
    res.json({
        estado: true,
        mensaje: 'Bienvenid@, inicia sesion o registrate por favor =)',
    });
});

// Ruta protegida /home
app.use('/home', homeRoutes);
app.use('/denuncia', denunciaRoutes);

// Configuración de Swagger
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Backend de Denuncias en Barrios',
            version: '1.0.0',
            description: 'Documentación de la API para Denuncias en Barrios',
        },
        servers: [
            {
                url: 'https://back-barrios-462cb6c76674.herokuapp.com', 
            },
        ],
    },
    apis: ['./src/Routes/authRoutes.js', './src/Models/user.js', 'src/Models/denuncia.js', 'src/Routes/denunciaRoutes.js']
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Iniciar servidor
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Servidor en ejecución en el puerto: ${PORT}`);
});
