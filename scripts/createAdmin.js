/**
 * Script para crear un administrador
 * 
 * Uso: node scripts/createAdmin.js
 */

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const readline = require('readline');
require('dotenv').config();

// Importar modelo
const Admin = require('../src/Models/admin');

// Configuración de conexión
const uri = process.env.MONGODB_URI || `mongodb://localhost:27017/barrios`;

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

// Configurar readline para input del usuario
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Función para hacer preguntas
const question = (query) => new Promise((resolve) => rl.question(query, resolve));

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
 * Validar email
 */
function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

/**
 * Crear administrador
 */
async function crearAdministrador() {
    try {
        log.title('🔐 CREAR NUEVO ADMINISTRADOR');
        console.log('');

        // Solicitar datos del administrador
        const nombreCompleto = await question('Nombre completo: ');
        if (!nombreCompleto || nombreCompleto.trim().length < 3) {
            log.error('El nombre debe tener al menos 3 caracteres');
            return false;
        }

        let email;
        while (true) {
            email = await question('Email: ');
            if (!validarEmail(email)) {
                log.error('Email inválido. Intenta de nuevo.');
                continue;
            }

            // Verificar si el email ya existe
            const existente = await Admin.findOne({ email });
            if (existente) {
                log.error(`Ya existe un administrador con el email: ${email}`);
                const continuar = await question('¿Deseas usar otro email? (s/n): ');
                if (continuar.toLowerCase() !== 's') {
                    return false;
                }
                continue;
            }
            break;
        }

        let password;
        while (true) {
            password = await question('Contraseña (mínimo 6 caracteres): ');
            if (password.length < 6) {
                log.error('La contraseña debe tener al menos 6 caracteres');
                continue;
            }

            const confirmPassword = await question('Confirmar contraseña: ');
            if (password !== confirmPassword) {
                log.error('Las contraseñas no coinciden. Intenta de nuevo.');
                continue;
            }
            break;
        }

        console.log('');
        log.info('Creando administrador...');

        // Encriptar contraseña
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Crear administrador
        const nuevoAdmin = new Admin({
            nombreCompleto: nombreCompleto.trim(),
            email: email.trim().toLowerCase(),
            password: passwordHash,
            isVerified: true,  // Verificado por defecto
            isDeleted: false
        });

        await nuevoAdmin.save();

        console.log('');
        log.success('¡Administrador creado exitosamente!');
        console.log('');
        log.info('Datos del administrador:');
        console.log(`  - ID: ${nuevoAdmin._id}`);
        console.log(`  - Nombre: ${nuevoAdmin.nombreCompleto}`);
        console.log(`  - Email: ${nuevoAdmin.email}`);
        console.log(`  - Verificado: Sí`);
        console.log('');
        log.info('Puedes iniciar sesión con estas credenciales en el sistema.');
        console.log('');

        return true;
    } catch (error) {
        log.error(`Error al crear administrador: ${error.message}`);
        return false;
    }
}

/**
 * Función principal
 */
async function main() {
    try {
        // Conectar a la base de datos
        const conectado = await conectarDB();
        if (!conectado) {
            process.exit(1);
        }

        // Crear administrador
        await crearAdministrador();

    } catch (error) {
        log.error(`Error: ${error.message}`);
    } finally {
        // Cerrar conexión y readline
        rl.close();
        await mongoose.connection.close();
        log.info('Conexión cerrada');
    }
}

// Ejecutar
main();
