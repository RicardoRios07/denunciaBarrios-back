/**
 * Script avanzado para generar denuncias personalizadas
 * Permite controlar:
 * - Cantidad de denuncias a generar
 * - Categorías específicas
 * - Estados específicos
 * - Prioridades específicas
 * - Usuarios específicos
 * 
 * Uso: node scripts/generateDenunciasAdvanced.js [opciones]
 * 
 * Ejemplos:
 *  node scripts/generateDenunciasAdvanced.js --cantidad 50
 *  node scripts/generateDenunciasAdvanced.js --cantidad 10 --categoria "Agua Potable"
 *  node scripts/generateDenunciasAdvanced.js --cantidad 20 --prioridad Alta --estado "En revisión"
 */

const mongoose = require('mongoose');
const fs = require('fs');
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

// Datos de denuncias
const categoriasYTitulos = {
    'Agua Potable, Alcantarillado Sanitario, Alcantarillado Pluvial': [
        'Tubo roto en calle principal', 'Fuga de agua potable en barrio', 'Alcantarilla obstruida',
        'Agua contaminada en sector residencial', 'Colapso de red de alcantarillado', 'Filtraciones en sistema'
    ],
    'Recolección de Desechos y Saneamiento Ambiental': [
        'Basura acumulada en esquina pública', 'Falta de recolección durante semana', 'Vertedero ilegal',
        'Residuos tóxicos en lote baldío', 'Contaminación ambiental', 'Falta de limpieza en parque'
    ],
    'Movilidad Urbana: Bacheo de Calles, Frecuencias, Obstrucciones de aceras, etc.': [
        'Baches profundos en avenida', 'Acera obstruida por vendedores', 'Falta de buses',
        'Semáforo dañado', 'Calzada deteriorada', 'Obstrucción de paso peatonal'
    ],
    'Obstrucción de vías por construcciones, ornato, permisos de construcción': [
        'Construcción sin permiso', 'Obra sin señalización', 'Escombros bloqueando vía',
        'Permiso de construcción vencido', 'Estructura temporal sin autorización', 'Material de construcción en acera'
    ]
};

const descripciones = [
    'Se evidencia un problema grave que requiere intervención urgente del municipio.',
    'La situación afecta a múltiples familias del sector y requiere solución rápida.',
    'Existe riesgo para la salud pública y la seguridad de los ciudadanos.',
    'El problema lleva varios días sin solución y está empeorando.',
    'Se solicita intervención municipal inmediata para resolver esta situación.',
    'Los vecinos reportan afectaciones significativas a su calidad de vida.',
    'La infraestructura presenta daños graves que requieren reparación.',
    'Esta denuncia es resultado del descuido y falta de mantenimiento municipal.'
];

const imagenesEvidencia = [
    'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400',
    'https://images.unsplash.com/photo-1559027615-cd61628aa1a9?w=400',
    'https://images.unsplash.com/photo-1584622181563-430f63602d4b?w=400',
    'https://images.unsplash.com/photo-1494787564596-18183726cb8f?w=400',
    'https://images.unsplash.com/photo-1470114716159-e389f8712fda?w=400',
];

const ubicacionesLoja = [
    { coords: [-79.2050, -3.9899], barrio: 'Centro Histórico' },
    { coords: [-79.2000, -3.9950], barrio: 'Zona Rosa' },
    { coords: [-79.2100, -3.9850], barrio: 'Sector Este' },
    { coords: [-79.1950, -3.9900], barrio: 'Sector Oeste' },
    { coords: [-79.2080, -3.9920], barrio: 'San Sebastián' },
    { coords: [-79.2030, -3.9870], barrio: 'Nueva Urbanización' },
    { coords: [-79.2110, -3.9930], barrio: 'Sector Norte' },
    { coords: [-79.1980, -3.9880], barrio: 'Sector Sur' }
];

const estados = ['En revisión', 'En proceso', 'Atendida', 'No procede'];
const prioridades = ['Baja', 'Media', 'Alta', 'Urgente'];

/**
 * Parsear argumentos de línea de comandos
 */
function parsearArgumentos() {
    const args = process.argv.slice(2);
    const opciones = {
        cantidad: 10,
        categoria: null,
        estado: null,
        prioridad: null,
        usuarioId: null,
        help: false
    };

    for (let i = 0; i < args.length; i++) {
        const arg = args[i];

        if (arg === '--cantidad' && args[i + 1]) {
            opciones.cantidad = parseInt(args[i + 1], 10);
        } else if (arg === '--categoria' && args[i + 1]) {
            opciones.categoria = args[i + 1];
        } else if (arg === '--estado' && args[i + 1]) {
            opciones.estado = args[i + 1];
        } else if (arg === '--prioridad' && args[i + 1]) {
            opciones.prioridad = args[i + 1];
        } else if (arg === '--usuario' && args[i + 1]) {
            opciones.usuarioId = args[i + 1];
        } else if (arg === '--help' || arg === '-h') {
            opciones.help = true;
        }
    }

    return opciones;
}

/**
 * Mostrar ayuda
 */
function mostrarAyuda() {
    console.log(`
${colors.cyan}${colors.bright}╔════════════════════════════════════════════════════════════╗${colors.reset}
${colors.cyan}${colors.bright}║     GENERADOR AVANZADO DE DENUNCIAS DE PRUEBA              ║${colors.reset}
${colors.cyan}${colors.bright}╚════════════════════════════════════════════════════════════╝${colors.reset}

${colors.yellow}Uso:${colors.reset}
  node scripts/generateDenunciasAdvanced.js [opciones]

${colors.yellow}Opciones:${colors.reset}
  --cantidad <número>      Número de denuncias a generar (default: 10)
  --categoria <nombre>     Generar solo de esta categoría
  --estado <estado>        Generar con este estado específico
  --prioridad <nivel>      Generar con esta prioridad específica
  --usuario <id>           Generar todos para un usuario específico
  --help, -h               Mostrar esta ayuda

${colors.yellow}Categorías disponibles:${colors.reset}
  1. Agua Potable, Alcantarillado Sanitario, Alcantarillado Pluvial
  2. Recolección de Desechos y Saneamiento Ambiental
  3. Movilidad Urbana: Bacheo de Calles, Frecuencias, Obstrucciones de aceras, etc.
  4. Obstrucción de vías por construcciones, ornato, permisos de construcción

${colors.yellow}Estados disponibles:${colors.reset}
  - En revisión
  - En proceso
  - Atendida
  - No procede

${colors.yellow}Prioridades disponibles:${colors.reset}
  - Baja
  - Media
  - Alta
  - Urgente

${colors.yellow}Ejemplos:${colors.reset}
  # Generar 50 denuncias generales
  node scripts/generateDenunciasAdvanced.js --cantidad 50

  # Generar 20 denuncias solo de agua
  node scripts/generateDenunciasAdvanced.js --cantidad 20 --categoria "Agua Potable, Alcantarillado Sanitario, Alcantarillado Pluvial"

  # Generar 15 denuncias urgentes
  node scripts/generateDenunciasAdvanced.js --cantidad 15 --prioridad Urgente

  # Generar 10 denuncias en revisión de un usuario específico
  node scripts/generateDenunciasAdvanced.js --cantidad 10 --usuario [ID_USUARIO] --estado "En revisión"

  # Generar 5 denuncias prioritarias de desechos en proceso
  node scripts/generateDenunciasAdvanced.js --cantidad 5 --categoria "Recolección de Desechos y Saneamiento Ambiental" --prioridad Alta --estado "En proceso"
    `);
}

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
        log.error(`Error al conectar: ${error.message}`);
        return false;
    }
}

/**
 * Obtener usuarios disponibles
 */
async function obtenerUsuarios(usuarioId = null) {
    try {
        let query = {};
        if (usuarioId) {
            query._id = usuarioId;
        }
        const usuarios = await User.find(query);
        return usuarios;
    } catch (error) {
        log.error(`Error al obtener usuarios: ${error.message}`);
        return [];
    }
}

/**
 * Función auxiliar
 */
function obtenerAleatorio(array) {
    return array[Math.floor(Math.random() * array.length)];
}

/**
 * Generar denuncias
 */
async function generarDenuncias(opciones, usuarios) {
    if (usuarios.length === 0) {
        log.error('No hay usuarios disponibles');
        return [];
    }

    const denunciasCreadas = [];
    const categorias = opciones.categoria
        ? Object.keys(categoriasYTitulos).filter(c => c.includes(opciones.categoria))
        : Object.keys(categoriasYTitulos);

    if (categorias.length === 0) {
        log.error(`Categoría no encontrada: ${opciones.categoria}`);
        log.info('Categorías disponibles:');
        Object.keys(categoriasYTitulos).forEach((cat, idx) => {
            console.log(`  ${idx + 1}. ${cat}`);
        });
        return [];
    }

    for (let i = 0; i < opciones.cantidad; i++) {
        try {
            const usuario = obtenerAleatorio(usuarios);
            const categoria = obtenerAleatorio(categorias);
            const titulos = categoriasYTitulos[categoria];
            const titulo = obtenerAleatorio(titulos);
            const ubicacion = obtenerAleatorio(ubicacionesLoja);
            const estado = opciones.estado || obtenerAleatorio(estados);
            const prioridad = opciones.prioridad || obtenerAleatorio(prioridades);
            const imagen = obtenerAleatorio(imagenesEvidencia);
            const fecha = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toLocaleDateString('es-ES');

            const nuevaDenuncia = new Denuncia({
                tituloDenuncia: titulo,
                idDenunciante: usuario._id,
                nombreDenunciante: usuario.nombreCompleto,
                descripcion: obtenerAleatorio(descripciones),
                evidencia: imagen,
                ubicacion: {
                    type: 'Point',
                    coordinates: ubicacion.coords
                },
                categoria: categoria,
                estado: estado,
                prioridad: prioridad,
                fechaHora: fecha,
                historialEstados: [{
                    estado: 'En revisión',
                    fecha: new Date(fecha),
                    observaciones: 'Denuncia creada'
                }]
            });

            await nuevaDenuncia.save();
            denunciasCreadas.push(nuevaDenuncia);

            log.success(`Denuncia ${i + 1}/${opciones.cantidad}: ${titulo.substring(0, 40)}`);
            log.data(`   Usuario: ${usuario.nombreCompleto} | Prioridad: ${prioridad}`);

        } catch (error) {
            log.error(`Error en denuncia ${i + 1}: ${error.message}`);
        }
    }

    // Actualizar contador de usuarios
    for (const usuario of usuarios) {
        const countDenuncias = await Denuncia.countDocuments({ idDenunciante: usuario._id });
        usuario.numDenunciasRealizadas = countDenuncias;
        await usuario.save();
    }

    return denunciasCreadas;
}

/**
 * Mostrar resumen
 */
function mostrarResumen(opciones, denuncias) {
    if (denuncias.length === 0) {
        log.warn('No se crearon denuncias');
        return;
    }

    log.title('═══════════════════════════════════════════════════');
    log.title('       DENUNCIAS GENERADAS EXITOSAMENTE            ');
    log.title('═══════════════════════════════════════════════════');

    console.log(`\n📊 RESUMEN:`);
    console.log(`   Total creadas: ${denuncias.length}`);

    if (opciones.categoria) console.log(`   Categoría: ${opciones.categoria}`);
    if (opciones.estado) console.log(`   Estado: ${opciones.estado}`);
    if (opciones.prioridad) console.log(`   Prioridad: ${opciones.prioridad}`);

    // Agrupar por categoría
    const porCategoria = {};
    denuncias.forEach(d => {
        const cat = d.categoria.substring(0, 20) + '...';
        porCategoria[cat] = (porCategoria[cat] || 0) + 1;
    });

    console.log('\n✅ Por categoría:');
    Object.entries(porCategoria).forEach(([cat, count]) => {
        console.log(`   - ${cat}: ${count}`);
    });

    // Agrupar por estado
    const porEstado = {};
    denuncias.forEach(d => {
        porEstado[d.estado] = (porEstado[d.estado] || 0) + 1;
    });

    console.log('\n✅ Por estado:');
    Object.entries(porEstado).forEach(([estado, count]) => {
        console.log(`   - ${estado}: ${count}`);
    });

    // Agrupar por prioridad
    const porPrioridad = {};
    denuncias.forEach(d => {
        porPrioridad[d.prioridad] = (porPrioridad[d.prioridad] || 0) + 1;
    });

    console.log('\n✅ Por prioridad:');
    Object.entries(porPrioridad).forEach(([prior, count]) => {
        console.log(`   - ${prior}: ${count}`);
    });

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
        log.title('🚀 GENERADOR AVANZADO DE DENUNCIAS');

        const conectado = await conectarDB();
        if (!conectado) {
            process.exit(1);
        }

        console.log('');
        log.info(`Generando ${opciones.cantidad} denuncias...`);

        const usuarios = await obtenerUsuarios(opciones.usuarioId);
        const denuncias = await generarDenuncias(opciones, usuarios);

        console.log('');
        mostrarResumen(opciones, denuncias);
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

module.exports = { generarDenuncias };
