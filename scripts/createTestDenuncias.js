/**
 * Script para crear denuncias de prueba realistas
 * Genera múltiples denuncias con:
 * - Diferentes usuarios denunciantes
 * - Diferentes categorías
 * - Diferentes estados
 * - Diferentes prioridades
 * - Ubicaciones variadas en Loja
 * - Descripciones realistas
 * 
 * Uso: node scripts/createTestDenuncias.js
 */

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

// Importar modelos
const User = require('../src/Models/user');
const Denuncia = require('../src/Models/denuncia');

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
    cyan: '\x1b[36m',
    magenta: '\x1b[35m'
};

// Función para imprimir con color
const log = {
    success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
    error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
    info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
    warn: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
    title: (msg) => console.log(`\n${colors.cyan}${colors.bright}${msg}${colors.reset}`),
    data: (msg) => console.log(`${colors.magenta}${msg}${colors.reset}`)
};

// Datos de usuarios de prueba a crear
const usuariosTest = [
    {
        nombreCompleto: 'Juan Pérez García',
        cedula: '1234567890',
        numTelefono: '0987654321',
        email: 'juan.perez@test.com',
        password: 'usuario123',
        photo: 'https://ui-avatars.com/api/?name=Juan+Perez&background=4F46E5&color=fff&size=200',
        isVerified: true,
        isBlocked: false
    },
    {
        nombreCompleto: 'María López Rodríguez',
        cedula: '1987654321',
        numTelefono: '0998765432',
        email: 'maria.lopez@test.com',
        password: 'usuario123',
        photo: 'https://ui-avatars.com/api/?name=Maria+Lopez&background=EC4899&color=fff&size=200',
        isVerified: true,
        isBlocked: false
    },
    {
        nombreCompleto: 'Carlos González Martínez',
        cedula: '1555666777',
        numTelefono: '0997654321',
        email: 'carlos.gonzalez@test.com',
        password: 'usuario123',
        photo: 'https://ui-avatars.com/api/?name=Carlos+Gonzalez&background=8B5CF6&color=fff&size=200',
        isVerified: true,
        isBlocked: false
    },
    {
        nombreCompleto: 'Ana Martínez Jiménez',
        cedula: '1777888999',
        numTelefono: '0986543210',
        email: 'ana.martinez@test.com',
        password: 'usuario123',
        photo: 'https://ui-avatars.com/api/?name=Ana+Martinez&background=F43F5E&color=fff&size=200',
        isVerified: true,
        isBlocked: false
    },
    {
        nombreCompleto: 'Roberto Castro Valencia',
        cedula: '1111222333',
        numTelefono: '0995555666',
        email: 'roberto.castro@test.com',
        password: 'usuario123',
        photo: 'https://ui-avatars.com/api/?name=Roberto+Castro&background=10B981&color=fff&size=200',
        isVerified: true,
        isBlocked: false
    }
];

// Datos para generar denuncias realistas
const categoriasYTitulos = {
    'Agua Potable, Alcantarillado Sanitario, Alcantarillado Pluvial': [
        'Tubo roto en calle principal',
        'Fuga de agua potable en barrio de El Centro',
        'Alcantarilla obstruida por residuos',
        'Agua contaminada en sector residencial',
        'Colapso de red de alcantarillado',
        'Filtraciones en sistema de agua potable'
    ],
    'Recolección de Desechos y Saneamiento Ambiental': [
        'Basura acumulada en esquina pública',
        'Falta de recolección de desechos durante semana',
        'Vertedero ilegal en área verde',
        'Residuos tóxicos en lote baldío',
        'Contaminación ambiental por residuos industriales',
        'Falta de limpieza en parque público'
    ],
    'Movilidad Urbana: Bacheo de Calles, Frecuencias, Obstrucciones de aceras, etc.': [
        'Baches profundos en avenida principal',
        'Acera obstruida por vendedores ambulantes',
        'Falta de buses en horario especificado',
        'Semáforo dañado en intersección peligrosa',
        'Calzada deteriorada en zona urbana',
        'Obstrucción de paso peatonal por estacionamiento ilegal'
    ],
    'Obstrucción de vías por construcciones, ornato, permisos de construcción': [
        'Construcción sin permiso municipal',
        'Obra en vía pública sin señalización',
        'Escombros bloqueando vía de circulación',
        'Permiso de construcción vencido sin retiro de obra',
        'Estructura temporal sin autorización',
        'Material de construcción depositado en acera'
    ]
};

const descripciones = {
    agua: [
        'Se evidencia un tubo roto que está perdiendo gran cantidad de agua. La situación requiere intervención urgente.',
        'Existe una fuga importante que ha causado asentamientos en la calle. Los vecinos reportan falta de agua durante días.',
        'El sistema de alcantarillado está colapsado causando malos olores y afectación a la salud pública.',
        'Se puede observar agua contaminada con sedimentos oscuros que afecta a varias familias del sector.',
        'La red de agua potable está dañada y requiere revisión y reparación inmediata por especialistas.'
    ],
    desechos: [
        'Hay acumulación de basura que ha atraído roedores y causa problemas de salubridad en el lugar.',
        'Los contenedores están desbordados y no se ha hecho recolección en una semana.',
        'Se ha identificado un vertedero ilegal donde se depositan residuos de construcción y domésticos.',
        'Residuos peligrosos están siendo acumulados sin medidas de contención adecuadas.',
        'El área presenta suciedad extrema que afecta la calidad del aire y atrae plagas.'
    ],
    movilidad: [
        'Existen múltiples baches que hacen intransitable la vía y ponen en riesgo a conductores y peatones.',
        'La acera está completamente obstruida impidiendo el paso de personas con discapacidad.',
        'Los buses no llegan en el horario prometido, afectando a estudiantes y trabajadores.',
        'El semáforo está inoperativo generando peligro vial en una intersección muy transitada.',
        'La calzada presenta grietas y hundimientos que requieren bacheo urgente.'
    ],
    construccion: [
        'Existe una construcción en desarrollo sin los permisos municipales correspondientes ni señalización.',
        'La obra está ocupando parte de la vía pública generando riesgos para peatones y vehículos.',
        'Los escombros no están siendo retirados adecuadamente y obstruyen el paso público.',
        'El permiso de construcción venció pero la obra sigue en desarrollo sin autorización.',
        'Material pesado de construcción está depositado sin protección en área de circulación pública.'
    ]
};

// URLs de imágenes de ejemplo para evidencias
const imagenesEvidencia = [
    'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400',
    'https://images.unsplash.com/photo-1559027615-cd61628aa1a9?w=400',
    'https://images.unsplash.com/photo-1584622181563-430f63602d4b?w=400',
    'https://images.unsplash.com/photo-1494787564596-18183726cb8f?w=400',
    'https://images.unsplash.com/photo-1470114716159-e389f8712fda?w=400',
    'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400',
    'https://images.unsplash.com/photo-1567016432779-094069958ea5?w=400',
    'https://images.unsplash.com/photo-1644571305970-59a9d1f1b9f5?w=400',
    'https://images.unsplash.com/photo-1511349967149-a973f5ab2e64?w=400',
    'https://images.unsplash.com/photo-1559027615-cd61628aa1a9?w=400'
];

// Coordenadas de barrios en Loja para ubicaciones variadas
const ubicacionesLoja = [
    { coords: [-79.2050, -3.9899], barrio: 'Centro Histórico' },
    { coords: [-79.2000, -3.9950], barrio: 'Zona Rosa' },
    { coords: [-79.2100, -3.9850], barrio: 'Sector Este' },
    { coords: [-79.1950, -3.9900], barrio: 'Sector Oeste' },
    { coords: [-79.2080, -3.9920], barrio: 'Barrio San Sebastián' },
    { coords: [-79.2030, -3.9870], barrio: 'Urbanización Nueva' },
    { coords: [-79.2110, -3.9930], barrio: 'Sector Norte' },
    { coords: [-79.1980, -3.9880], barrio: 'Sector Sur' }
];

// Estados posibles de las denuncias
const estados = ['En revisión', 'En proceso', 'Atendida', 'No procede'];

// Prioridades posibles
const prioridades = ['Baja', 'Media', 'Alta', 'Urgente'];

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
 * Crear usuarios de prueba
 */
async function crearUsuariosPrueba() {
    const usuariosCreados = [];
    
    for (const userData of usuariosTest) {
        try {
            // Verificar si ya existe
            const existente = await User.findOne({ email: userData.email });
            if (existente) {
                log.warn(`Usuario ya existe: ${userData.email}`);
                usuariosCreados.push(existente);
                continue;
            }

            // Encriptar contraseña
            const salt = await bcrypt.genSalt(10);
            const passwordHash = await bcrypt.hash(userData.password, salt);

            // Crear usuario
            const nuevoUsuario = new User({
                ...userData,
                password: passwordHash,
                numDenunciasRealizadas: 0
            });

            await nuevoUsuario.save();
            log.success(`Usuario creado: ${userData.nombreCompleto}`);
            usuariosCreados.push(nuevoUsuario);
        } catch (error) {
            log.error(`Error al crear usuario ${userData.nombreCompleto}: ${error.message}`);
        }
    }

    return usuariosCreados;
}

/**
 * Función auxiliar para obtener elemento aleatorio de un array
 */
function obtenerAleatorio(array) {
    return array[Math.floor(Math.random() * array.length)];
}

/**
 * Obtener descripción según categoría
 */
function obtenerDescripcion(categoria) {
    if (categoria.includes('Agua')) {
        return obtenerAleatorio(descripciones.agua);
    } else if (categoria.includes('Desechos') || categoria.includes('Saneamiento')) {
        return obtenerAleatorio(descripciones.desechos);
    } else if (categoria.includes('Movilidad')) {
        return obtenerAleatorio(descripciones.movilidad);
    } else {
        return obtenerAleatorio(descripciones.construccion);
    }
}

/**
 * Generar fecha aleatoria dentro de los últimos 30 días
 */
function generarFechaAleatoria() {
    const ahora = new Date();
    const fecha = new Date(ahora.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000);
    return fecha.toLocaleDateString('es-ES');
}

/**
 * Generar una fecha para historial (más antigua que la denuncia)
 */
function generarFechaHistorial(fechaDenuncia) {
    const ahora = new Date();
    return new Date(ahora.getTime() - Math.random() * 25 * 24 * 60 * 60 * 1000);
}

/**
 * Crear denuncias de prueba
 */
async function crearDenunciasPrueba(usuarios) {
    let contadorCreadas = 0;
    const denunciasCreadas = [];
    
    if (usuarios.length === 0) {
        log.error('No hay usuarios disponibles para crear denuncias');
        return [];
    }

    // Generar 20 denuncias variadas
    const totalDenuncias = 20;
    const categorias = Object.keys(categoriasYTitulos);

    for (let i = 0; i < totalDenuncias; i++) {
        try {
            // Seleccionar datos aleatorios
            const usuario = obtenerAleatorio(usuarios);
            const categoria = obtenerAleatorio(categorias);
            const titulos = categoriasYTitulos[categoria];
            const titulo = obtenerAleatorio(titulos);
            const ubicacion = obtenerAleatorio(ubicacionesLoja);
            const estado = obtenerAleatorio(estados);
            const prioridad = obtenerAleatorio(prioridades);
            const imagen = obtenerAleatorio(imagenesEvidencia);
            const fecha = generarFechaAleatoria();

            // Crear denuncia
            const nuevaDenuncia = new Denuncia({
                tituloDenuncia: titulo,
                idDenunciante: usuario._id,
                nombreDenunciante: usuario.nombreCompleto,
                descripcion: obtenerDescripcion(categoria),
                evidencia: imagen,
                ubicacion: {
                    type: 'Point',
                    coordinates: ubicacion.coords
                },
                categoria: categoria,
                estado: estado,
                prioridad: prioridad,
                fechaHora: fecha,
                historialEstados: [
                    {
                        estado: 'En revisión',
                        fecha: generarFechaHistorial(new Date(fecha)),
                        observaciones: 'Denuncia creada'
                    }
                ]
            });

            await nuevaDenuncia.save();
            denunciasCreadas.push(nuevaDenuncia);
            contadorCreadas++;

            log.success(`Denuncia ${contadorCreadas}: ${titulo}`);
            log.data(`   Denunciante: ${usuario.nombreCompleto}`);
            log.data(`   Categoría: ${categoria}`);
            log.data(`   Estado: ${estado} | Prioridad: ${prioridad}`);
            
        } catch (error) {
            log.error(`Error al crear denuncia ${i + 1}: ${error.message}`);
        }
    }

    // Actualizar contador de denuncias de usuarios
    for (const usuario of usuarios) {
        const countDenuncias = await Denuncia.countDocuments({ idDenunciante: usuario._id });
        usuario.numDenunciasRealizadas = countDenuncias;
        await usuario.save();
    }

    return denunciasCreadas;
}

/**
 * Mostrar resumen de datos creados
 */
function mostrarResumen(usuarios, denuncias) {
    log.title('═══════════════════════════════════════════════════');
    log.title('    DATOS DE PRUEBA CREADOS EXITOSAMENTE           ');
    log.title('═══════════════════════════════════════════════════');
    
    console.log(`\n👥 USUARIOS CREADOS: ${usuarios.length}`);
    usuarios.forEach((usuario, idx) => {
        const denunciasDel = denuncias.filter(d => d.idDenunciante.toString() === usuario._id.toString()).length;
        console.log(`   ${idx + 1}. ${usuario.nombreCompleto}`);
        console.log(`      Email: ${usuario.email}`);
        console.log(`      Denuncias: ${denunciasDel}`);
    });

    console.log(`\n📋 DENUNCIAS CREADAS: ${denuncias.length}`);
    
    // Agrupar por categoría
    const porCategoria = {};
    denuncias.forEach(d => {
        porCategoria[d.categoria] = (porCategoria[d.categoria] || 0) + 1;
    });
    
    console.log('   Por categoría:');
    Object.entries(porCategoria).forEach(([categoria, count]) => {
        console.log(`      - ${categoria}: ${count}`);
    });

    // Agrupar por estado
    const porEstado = {};
    denuncias.forEach(d => {
        porEstado[d.estado] = (porEstado[d.estado] || 0) + 1;
    });
    
    console.log('   Por estado:');
    Object.entries(porEstado).forEach(([estado, count]) => {
        console.log(`      - ${estado}: ${count}`);
    });

    // Agrupar por prioridad
    const porPrioridad = {};
    denuncias.forEach(d => {
        porPrioridad[d.prioridad] = (porPrioridad[d.prioridad] || 0) + 1;
    });
    
    console.log('   Por prioridad:');
    Object.entries(porPrioridad).forEach(([prioridad, count]) => {
        console.log(`      - ${prioridad}: ${count}`);
    });

    console.log('\n🔐 CREDENCIALES DE PRUEBA:');
    usuarios.forEach((usuario, idx) => {
        console.log(`\n   Usuario ${idx + 1}:`);
        console.log(`   Email:    ${usuario.email}`);
        console.log(`   Password: usuario123`);
    });

    console.log('\n🌐 ENDPOINTS PARA PROBAR:');
    console.log('   GET  http://localhost:3085/denuncia              (Listar todas)');
    console.log('   GET  http://localhost:3085/denuncia/:id          (Obtener una)');
    console.log('   GET  http://localhost:3085/denuncia/user/:id     (Por usuario)');
    console.log('   POST http://localhost:3085/denuncia              (Crear nueva)');

    log.title('═══════════════════════════════════════════════════\n');
}

/**
 * Función principal
 */
async function main() {
    try {
        log.title('🚀 INICIANDO GENERACIÓN DE DATOS DE PRUEBA');
        
        // Conectar a la base de datos
        const conectado = await conectarDB();
        if (!conectado) {
            process.exit(1);
        }

        console.log('');
        
        // Crear usuarios
        log.info('Creando usuarios de prueba...');
        const usuarios = await crearUsuariosPrueba();
        console.log('');
        
        // Crear denuncias
        log.info('Generando denuncias de prueba...');
        const denuncias = await crearDenunciasPrueba(usuarios);
        console.log('');
        
        // Mostrar resumen
        mostrarResumen(usuarios, denuncias);
        
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

module.exports = { crearDenunciasPrueba, crearUsuariosPrueba };
