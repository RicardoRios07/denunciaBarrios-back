const mongoose = require('mongoose');
require('dotenv').config();

// Conexión a Base de datos
const uri = process.env.MONGODB_URI || `mongodb://localhost:27017/barrios`;

mongoose
    .connect(uri, { 
        useNewUrlParser: true, 
        useUnifiedTopology: true,
        dbName: 'barrios'
    })
    .then(() => console.log('Se estableció conexión con la base de datos: barrios'))
    .catch((e) => console.log('Error de conexión a la base de datos:', e));

exports.mongoose = mongoose;    