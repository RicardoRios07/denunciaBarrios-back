/**
 * Script para limpiar datos de prueba
 * Elimina:
 * - Todas las denuncias de prueba
 * - Usuarios de prueba (opcional)
 * 
 * Uso: node scripts/cleanTestData.js [opciones]
 * 
 * Ejemplos:
 *  node scripts/cleanTestData.js                    (Limpia solo denuncias)
 *  node scripts/cleanTestData.js --usuarios         (Limpia users + denuncias)
 *  node scripts/cleanTestData.js --todo             (Limpia todo)
 *  node scripts/cleanTestData.js --help             (Ver ayuda)
 */

const mongoose = require('mongoose');
require('dotenv').config();

// Importar modelos
const User = require('../src/Models/user');
const Denuncia = require('../src/Models/denuncia');

// Configuración
const uri = process.env.MONGODB_URI || `mongodb://localhost:27017/barrios`;

// Colores
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m',
    magenta: '\x1b[35m'
};

const log = {
    success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
    error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
    info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
    warn: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
    title: (msg) => console.log(`\n${colors.cyan}${colors.bright}${msg}${colors.reset}`),
    data: (msg) => console.log(`${colors.magenta}${msg}${colors.reset}`)
};

// Usuarios de prueba a identificar
const usuariosTest = [
    'usuario@test.com',
    'juan.perez@test.com',
    'maria.lopez@test.com',
    'carlos.gonzalez@test.com',
    'ana.martinez@test.com',
    'roberto.castro@test.com'
];

/**
 * Parsear argumentos
 */
function parsearArgumentos() {
    const args = process.argv.slice(2);
    const opciones = {
        usuarios: false,
        todo: false,
        help: false,
        confirm: false
    };

    for (const arg of args) {
        if (arg === '--usuarios') opciones.usuarios = true;
        else if (arg === '--todo') {
            opciones.usuarios = true;
            opciones.todo = true;
        } else if (arg === '--confirm') opciones.confirm = true;
        else if (arg === '--help' || arg === '-h') opciones.help = true;
    }

    return opciones;
}

/**
 * Mostrar ayuda
 */
function mostrarAyuda() {
    console.log(`
${colors.cyan}${colors.bright}╔════════════════════════════════════════════════════════════╗${colors.reset}
${colors.cyan}${colors.bright}║       HERRAMIENTA DE LIMPIEZA DE DATOS DE PRUEBA           ║${colors.reset}
${colors.cyan}${colors.bright}╚════════════════════════════════════════════════════════════╝${colors.reset}

${colors.yellow}Uso:${colors.reset}
  node scripts/cleanTestData.js [opciones]

${colors.yellow}Opciones:${colors.reset}
  (sin opciones)    Elimina SOLO todas las denuncias
  --usuarios        Elimina denuncias Y usuarios de prueba
  --todo            Elimina denuncias, usuarios y empiezas desde cero
  --confirm         Ejecutar sin confirmar (usa con cuidado)
  --help, -h        Mostrar esta ayuda

${colors.yellow}Ejemplos:${colors.reset}
  # Solo limpiar denuncias
  node scripts/cleanTestData.js

  # Limpiar denuncias y usuarios de prueba
  node scripts/cleanTestData.js --usuarios

  # Limpiar TODO sin confirmación
  node scripts/cleanTestData.js --todo --confirm

${colors.red}⚠️  ADVERTENCIA:${colors.reset}
  - Este script ELIMINA datos de forma PERMANENTE
  - No se puede recuperar lo que se elimine
  - Siempre hacer backup antes de ejecutar (en producción)
  - Usar solo en desarrollo/testing
    `);
}

/**
 * Pedir confirmación
 */
async function pedirConfirmacion(mensaje) {
    return new Promise((resolve) => {
        process.stdout.write(`${colors.yellow}${mensaje}${colors.reset}`);
        process.stdin.once('data', (data) => {
            const respuesta = data.toString().trim().toLowerCase();
            resolve(respuesta === 's' || respuesta === 'yes' || respuesta === 'y');
        });
    });
}

/**
 * Conectar a DB
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
        log.error(`Error al conectar: ${error.message}`);
        return false;
    }
}

/**
 * Contar datos
 */
async function contarDatos() {
    const totalDenuncias = await Denuncia.countDocuments();
    const totalUsuarios = await User.countDocuments();
    const usuariosTest = await User.countDocuments({ 
        email: { $in: usuariosTest } 
    });

    return { totalDenuncias, totalUsuarios, usuariosTest };
}

/**
 * Limpiar solo denuncias
 */
async function limpiarDenuncias() {
    try {
        const resultado = await Denuncia.deleteMany({});
        log.success(`Denuncias eliminadas: ${resultado.deletedCount}`);
        return resultado.deletedCount;
    } catch (error) {
        log.error(`Error al limpiar denuncias: ${error.message}`);
        return 0;
    }
}

/**
 * Limpiar usuarios de prueba
 */
async function limpiarUsuariosTest() {
    try {
        const emails = [
            'usuario@test.com',
            'juan.perez@test.com',
            'maria.lopez@test.com',
            'carlos.gonzalez@test.com',
            'ana.martinez@test.com',
            'roberto.castro@test.com'
        ];
        
        const resultado = await User.deleteMany({ email: { $in: emails } });
        log.success(`Usuarios de prueba eliminados: ${resultado.deletedCount}`);
        return resultado.deletedCount;
    } catch (error) {
        log.error(`Error al limpiar usuarios: ${error.message}`);
        return 0;
    }
}

/**
 * Limpiar todo
 */
async function limpiarTodo() {
    try {
        const resultDenuncias = await Denuncia.deleteMany({});
        const resultUsuarios = await User.deleteMany({});
        
        log.success(`Todos los datos eliminados:`);
        log.data(`  - Denuncias: ${resultDenuncias.deletedCount}`);
        log.data(`  - Usuarios: ${resultUsuarios.deletedCount}`);
        
        return resultDenuncias.deletedCount + resultUsuarios.deletedCount;
    } catch (error) {
        log.error(`Error al limpiar: ${error.message}`);
        return 0;
    }
}

/**
 * Mostrar resumen antes de limpiar
 */
function mostrarResumenAntes(datos, opciones) {
    log.title('═══════════════════════════════════════════════════');
    log.warn('DATOS ACTUALES EN LA BASE DE DATOS:');
    log.title('═══════════════════════════════════════════════════');
    
    console.log(`\n📊 Total de registros:`);
    console.log(`   - Denuncias: ${datos.totalDenuncias}`);
    console.log(`   - Usuarios: ${datos.totalUsuarios}`);
    console.log(`   - Usuarios de prueba: ${datos.usuariosTest}`);
    
    console.log(`\n🗑️  SERÁ ELIMINADO:`);
    console.log(`   - Denuncias: ${datos.totalDenuncias}`);
    
    if (opciones.usuarios) {
        console.log(`   - Usuarios de prueba: ${datos.usuariosTest}`);
    } else {
        console.log(`   - Usuarios: ${colors.blue}(se mantendrán)${colors.reset}`);
    }
    
    console.log('');
}

/**
 * Mostrar resumen después
 */
function mostrarResumenDespues(denunciasEliminadas, usuariosEliminados) {
    log.title('═══════════════════════════════════════════════════');
    log.title('        LIMPIEZA COMPLETADA EXITOSAMENTE          ');
    log.title('═══════════════════════════════════════════════════');
    
    console.log(`\n✅ Datos eliminados:`);
    console.log(`   - Denuncias: ${denunciasEliminadas}`);
    if (usuariosEliminados > 0) {
        console.log(`   - Usuarios: ${usuariosEliminados}`);
    }
    
    console.log(`\n🔄 Puedes volver a generar datos con:`);
    console.log(`   - npm run seed`);
    console.log(`   - npm run create-denuncias`);
    log.title('═══════════════════════════════════════════════════\n');
}

/**
 * Función principal
 */
async function main() {
    const opciones = parsearArgumentos();

    if (opciones.help) {
        mostrarAyuda();
        process.exit(0);
    }

    try {
        // Configurar entrada de datos
        process.stdin.setEncoding('utf8');

        log.title('🧹 HERRAMIENTA DE LIMPIEZA DE DATOS');
        
        const conectado = await conectarDB();
        if (!conectado) {
            process.exit(1);
        }

        console.log('');

        // Obtener datos actuales
        log.info('Leyendo datos actuales...');
        const datos = await contarDatos();

        console.log('');

        // Mostrar resumen
        mostrarResumenAntes(datos, opciones);

        // Pedir confirmación (a menos que use --confirm)
        let continuar = opciones.confirm;
        if (!continuar) {
            continuar = await pedirConfirmacion('¿Estás seguro? (s/n): ');
        }

        if (!continuar) {
            log.warn('Operación cancelada por el usuario');
            console.log('');
            process.exit(0);
        }

        console.log('');
        log.info('Eliminando datos...\n');

        // Limpiar según opciones
        let denunciasEliminadas = 0;
        let usuariosEliminados = 0;

        if (opciones.todo) {
            const resultado = await limpiarTodo();
            denunciasEliminadas = datos.totalDenuncias;
            usuariosEliminados = datos.usuariosTest;
        } else {
            denunciasEliminadas = await limpiarDenuncias();
            if (opciones.usuarios) {
                usuariosEliminados = await limpiarUsuariosTest();
            }
        }

        console.log('');

        // Mostrar resumen final
        mostrarResumenDespues(denunciasEliminadas, usuariosEliminados);

        log.success('Proceso completado exitosamente\n');
        
    } catch (error) {
        log.error(`Error: ${error.message}`);
        console.error(error);
        process.exit(1);
    } finally {
        await mongoose.connection.close();
        log.info('Conexión cerrada\n');
        process.exit(0);
    }
}

if (require.main === module) {
    main();
}

module.exports = { limpiarDenuncias, limpiarUsuariosTest };
