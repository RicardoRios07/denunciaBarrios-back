/**
 * Script para crear usuarios de prueba
 * - 1 Usuario normal
 * - 1 Administrador
 * 
 * Uso: node scripts/createTestUsers.js
 */

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

// Importar modelos
const User = require('../src/Models/user');
const Admin = require('../src/Models/admin');

// Configuración de conexión
const uri = process.env.MONGO_URI || `mongodb://localhost:27017/barrios`;

// Colores para la consola
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m'
};

// Función para imprimir con color
const log = {
    success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
    error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
    info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
    warn: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
    title: (msg) => console.log(`\n${colors.cyan}${colors.bright}${msg}${colors.reset}`)
};

// Datos de usuario normal
const usuarioNormal = {
    nombreCompleto: 'Juan Pérez García',
    cedula: '1234567890',
    numTelefono: '0987654321',
    email: 'usuario@test.com',
    password: 'usuario123',
    photo: 'https://ui-avatars.com/api/?name=Juan+Perez&background=4F46E5&color=fff&size=200',
    isVerified: true,
    isBlocked: false,
    numDenunciasRealizadas: 0
};

// Datos de administrador
const usuarioAdmin = {
    nombreCompleto: 'Admin Principal',
    email: 'admin@test.com',
    password: 'admin123',
    isVerified: true,
    isDeleted: false
};

/**
 * Conectar a la base de datos
 */
async function conectarDB() {
    try {
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        log.success('Conectado a MongoDB');
        return true;
    } catch (error) {
        log.error(`Error al conectar a MongoDB: ${error.message}`);
        return false;
    }
}

/**
 * Crear usuario normal
 */
async function crearUsuarioNormal() {
    try {
        // Verificar si ya existe
        const existente = await User.findOne({ email: usuarioNormal.email });
        if (existente) {
            log.warn(`Usuario normal ya existe: ${usuarioNormal.email}`);
            log.info(`  ID: ${existente._id}`);
            return existente;
        }

        // Encriptar contraseña
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(usuarioNormal.password, salt);

        // Crear usuario
        const nuevoUsuario = new User({
            ...usuarioNormal,
            password: passwordHash
        });

        await nuevoUsuario.save();
        log.success(`Usuario normal creado exitosamente`);
        log.info(`  Email: ${usuarioNormal.email}`);
        log.info(`  Password: ${usuarioNormal.password}`);
        log.info(`  ID: ${nuevoUsuario._id}`);
        
        return nuevoUsuario;
    } catch (error) {
        log.error(`Error al crear usuario normal: ${error.message}`);
        throw error;
    }
}

/**
 * Crear administrador
 */
async function crearAdministrador() {
    try {
        // Verificar si ya existe
        const existente = await Admin.findOne({ email: usuarioAdmin.email });
        if (existente) {
            log.warn(`Administrador ya existe: ${usuarioAdmin.email}`);
            log.info(`  ID: ${existente._id}`);
            return existente;
        }

        // Encriptar contraseña
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(usuarioAdmin.password, salt);

        // Crear administrador
        const nuevoAdmin = new Admin({
            ...usuarioAdmin,
            password: passwordHash
        });

        await nuevoAdmin.save();
        log.success(`Administrador creado exitosamente`);
        log.info(`  Email: ${usuarioAdmin.email}`);
        log.info(`  Password: ${usuarioAdmin.password}`);
        log.info(`  ID: ${nuevoAdmin._id}`);
        
        return nuevoAdmin;
    } catch (error) {
        log.error(`Error al crear administrador: ${error.message}`);
        throw error;
    }
}

/**
 * Mostrar resumen
 */
function mostrarResumen() {
    log.title('═══════════════════════════════════════════════════');
    log.title('         USUARIOS DE PRUEBA CREADOS                ');
    log.title('═══════════════════════════════════════════════════');
    
    console.log('\n📱 USUARIO NORMAL:');
    console.log('   Email:    ', usuarioNormal.email);
    console.log('   Password: ', usuarioNormal.password);
    console.log('   Cédula:   ', usuarioNormal.cedula);
    console.log('   Teléfono: ', usuarioNormal.numTelefono);
    
    console.log('\n👨‍💼 ADMINISTRADOR:');
    console.log('   Email:    ', usuarioAdmin.email);
    console.log('   Password: ', usuarioAdmin.password);
    
    console.log('\n🔐 ENDPOINTS PARA PROBAR:');
    console.log('   Login Usuario: POST http://localhost:3085/auth/login');
    console.log('   Login Admin:   POST http://localhost:3085/admin/loginAdmin');
    
    console.log('\n💡 EJEMPLO DE REQUEST (Usuario):');
    console.log('   {');
    console.log(`     "email": "${usuarioNormal.email}",`);
    console.log(`     "password": "${usuarioNormal.password}"`);
    console.log('   }');
    
    console.log('\n💡 EJEMPLO DE REQUEST (Admin):');
    console.log('   {');
    console.log(`     "email": "${usuarioAdmin.email}",`);
    console.log(`     "password": "${usuarioAdmin.password}"`);
    console.log('   }');
    
    log.title('═══════════════════════════════════════════════════\n');
}

/**
 * Función principal
 */
async function main() {
    try {
        log.title('🚀 INICIANDO CREACIÓN DE USUARIOS DE PRUEBA');
        
        // Conectar a la base de datos
        const conectado = await conectarDB();
        if (!conectado) {
            process.exit(1);
        }

        console.log('');
        
        // Crear usuarios
        log.info('Creando usuario normal...');
        await crearUsuarioNormal();
        
        console.log('');
        
        log.info('Creando administrador...');
        await crearAdministrador();
        
        console.log('');
        
        // Mostrar resumen
        mostrarResumen();
        
        log.success('Proceso completado exitosamente\n');
        
    } catch (error) {
        log.error(`Error en el proceso: ${error.message}`);
        console.error(error);
        process.exit(1);
    } finally {
        // Cerrar conexión
        await mongoose.connection.close();
        log.info('Conexión a MongoDB cerrada');
        process.exit(0);
    }
}

// Ejecutar script
if (require.main === module) {
    main();
}

module.exports = { crearUsuarioNormal, crearAdministrador };
