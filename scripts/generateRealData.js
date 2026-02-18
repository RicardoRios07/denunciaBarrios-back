#!/usr/bin/env node

/**
 * Script para generar datos REALES usando API autenticada
 * Utiliza tokens JWT para crear denuncias
 * 
 * Uso:
 *   node scripts/generateRealData.js --user-token <token> --admin-token <token> [opciones]
 * 
 * Ejemplos:
 *   node scripts/generateRealData.js --user-token eyJhbG... --admin-token eyJhZG...
 *   node scripts/generateRealData.js --user-token eyJhbG... --admin-token eyJhZG... --cantidad 50
 */

const https = require('https');
const http = require('http');
const url = require('url');

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

const log = {
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  warn: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  title: (msg) => console.log(`\n${colors.cyan}${colors.bright}${msg}${colors.reset}`),
};

// Configuración
const API_URL = process.env.API_URL || 'http://localhost:3085';

// Parsed arguments
const args = process.argv.slice(2);
let config = {
  userToken: null,
  adminToken: null,
  cantidad: 20,
  verbose: false,
};

// Parse command line arguments
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--user-token') config.userToken = args[++i];
  if (args[i] === '--admin-token') config.adminToken = args[++i];
  if (args[i] === '--cantidad') config.cantidad = parseInt(args[++i]);
  if (args[i] === '--verbose') config.verbose = true;
  if (args[i] === '--help' || args[i] === '-h') showHelp();
}

// Validar tokens
if (!config.userToken || !config.adminToken) {
  log.error('Tokens JWT requeridos');
  showHelp();
  process.exit(1);
}

// Datos para generar
const categorias = [
  'Agua Potable, Alcantarillado Sanitario, Alcantarillado Pluvial',
  'Recolección de Desechos y Saneamiento Ambiental',
  'Movilidad Urbana: Bacheo de Calles, Frecuencias, Obstrucciones de aceras, etc.',
  'Obstrucción de vías por construcciones, ornato, permisos de construcción'
];

const titulos = {
  'Agua Potable, Alcantarillado Sanitario, Alcantarillado Pluvial': [
    'Tubo roto en calle principal',
    'Fuga de agua potable en barrio',
    'Alcantarilla obstruida',
    'Agua contaminada',
    'Colapso de tubería',
  ],
  'Recolección de Desechos y Saneamiento Ambiental': [
    'Basura acumulada en esquina',
    'Falta de recolección',
    'Vertedero ilegal',
    'Residuos tóxicos',
    'Contaminación ambiental',
  ],
  'Movilidad Urbana: Bacheo de Calles, Frecuencias, Obstrucciones de aceras, etc.': [
    'Baches profundos',
    'Acera obstruida',
    'Falta de buses',
    'Semáforo dañado',
    'Calzada deteriorada',
  ],
  'Obstrucción de vías por construcciones, ornato, permisos de construcción': [
    'Construcción sin permiso',
    'Obra sin señalización',
    'Escombros bloqueando vía',
    'Permiso vencido',
    'Estructura sin autorización',
  ],
};

const descripciones = [
  'Se evidencia un problema grave que requiere intervención urgente.',
  'La situación afecta a múltiples familias y requiere solución rápida.',
  'Existe riesgo para la salud pública y seguridad de ciudadanos.',
  'El problema lleva varios días sin solución.',
  'Se solicita intervención municipal inmediata.',
];

const barrios = [
  'Pucará',
  'Zamora Huayco',
  'San Sebastián',
  'La Argelia',
  'Punzara',
  'San Pedro',
  'Miraflores',
  'San Vicente',
  'Gran Colombia',
  'Menfis',
  'Bolonia',
  'El Plateado',
];

// Funciones helper
function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function makeRequest(method, path, data = null, token) {
  return new Promise((resolve, reject) => {
    const requestUrl = `${API_URL}${path}`;
    const urlObj = new url.URL(requestUrl);
    
    const isHttps = requestUrl.startsWith('https');
    const httpModule = isHttps ? https : http;

    // Crear boundary para multipart/form-data
    const boundary = '----WebKitFormBoundary' + Math.random().toString(36).substr(2);
    let body = '';

    // Agregar campos del formulario
    if (data) {
      for (const key in data) {
        if (typeof data[key] === 'object') {
          // Para objetos (como ubicacion), convertir a JSON string
          body += `--${boundary}\r\n`;
          body += `Content-Disposition: form-data; name="${key}"\r\n\r\n`;
          body += JSON.stringify(data[key]) + '\r\n';
        } else {
          body += `--${boundary}\r\n`;
          body += `Content-Disposition: form-data; name="${key}"\r\n\r\n`;
          body += data[key] + '\r\n';
        }
      }
    }

    // Agregar archivo dummy (pequeña imagen PNG 1x1 pixel en base64)
    const pngBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
    const imageBuffer = Buffer.from(pngBase64, 'base64');

    body += `--${boundary}\r\n`;
    body += `Content-Disposition: form-data; name="evidencia"; filename="evidencia.png"\r\n`;
    body += `Content-Type: image/png\r\n\r\n`;

    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname + urlObj.search,
      method: method,
      headers: {
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        'Authorization': `Bearer ${token}`,
      },
    };

    if (config.verbose) {
      log.info(`${method} ${path}`);
    }

    const req = httpModule.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseData);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, data: responseData });
        }
      });
    });

    req.on('error', (err) => {
      reject(new Error(`Connection error: ${err.code || err.message}`));
    });

    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    // Escribir el body
    req.write(body);
    req.write(imageBuffer);
    req.write(`\r\n--${boundary}--\r\n`);

    req.end();
  });
}

async function crearDenuncia() {
  const categoria = getRandomItem(categorias);
  const tituloDenuncia = getRandomItem(titulos[categoria] || titulos['Agua Potable, Alcantarillado Sanitario, Alcantarillado Pluvial']);
  const descripcion = getRandomItem(descripciones);
  const barrio = getRandomItem(barrios);

  // Generar coordenadas en el rango de Loja, Ecuador
  const longitud = -79.2 + Math.random() * 0.5;
  const latitud = -4.0 + Math.random() * 0.5;

  const denuncia = {
    tituloDenuncia,
    descripcion,
    categoria,
    ubicacion: {
      type: 'Point',
      coordinates: [longitud, latitud]
    },
    estado: 'Pendiente'
  };

  try {
    const response = await makeRequest('POST', '/denuncias/nuevaDenuncia', denuncia, config.userToken);

    if (response.status === 200 || response.status === 201) {
      log.success(`Denuncia creada: ${tituloDenuncia}`);
      return true;
    } else {
      if (config.verbose) {
        log.warn(`Error creando denuncia (${response.status}): ${JSON.stringify(response.data)}`);
      } else {
        log.warn(`Error creando denuncia (${response.status})`);
      }
      return false;
    }
  } catch (err) {
    if (config.verbose) {
      log.error(`Error en request: ${err.message || err}`);
    } else {
      log.warn(`Error creando denuncia`);
    }
    return false;
  }
}

async function generarDatos() {
  log.title('Generador de Datos Reales');
  log.info(`API URL: ${API_URL}`);
  log.info(`Cantidad de denuncias: ${config.cantidad}`);
  log.info(`Usuario Token: ${config.userToken.substring(0, 20)}...`);

  let exitosas = 0;
  let fallidas = 0;

  log.title('Creando denuncias...');

  for (let i = 0; i < config.cantidad; i++) {
    const exito = await crearDenuncia();
    if (exito) {
      exitosas++;
    } else {
      fallidas++;
    }

    // Pequeño delay para no saturar la API
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  log.title('Resumen');
  log.success(`Denuncias exitosas: ${exitosas}`);
  if (fallidas > 0) {
    log.warn(`Denuncias fallidas: ${fallidas}`);
  }

  log.info(`Total: ${exitosas + fallidas}/${config.cantidad}`);

  if (exitosas === config.cantidad) {
    log.success('¡Todos los datos generados correctamente!');
  }
}

function showHelp() {
  console.log(`
${colors.cyan}${colors.bright}Generador de Datos Reales - Denuncias Ciudadanas${colors.reset}

${colors.bright}Uso:${colors.reset}
  node scripts/generateRealData.js --user-token <token> --admin-token <token> [opciones]

${colors.bright}Opciones:${colors.reset}
  --user-token <token>      Token JWT de usuario (requerido)
  --admin-token <token>     Token JWT de administrador (requerido)
  --cantidad <num>          Cantidad de denuncias a generar (default: 20)
  --verbose                 Mostrar detalles completos
  --help, -h                Mostrar esta ayuda

${colors.bright}Ejemplos:${colors.reset}
  node scripts/generateRealData.js \\
    --user-token eyJhbGciOiJIUzI1NiIs... \\
    --admin-token eyJhZG1pbklkIjoiNjk4Y...

  node scripts/generateRealData.js \\
    --user-token eyJhbG... \\
    --admin-token eyJhZG... \\
    --cantidad 50 \\
    --verbose
  `);
  process.exit(0);
}

// Ejecutar
generarDatos()
  .then(() => {
    process.exit(0);
  })
  .catch((err) => {
    log.error(`Error fatal: ${err.message}`);
    if (config.verbose) console.error(err);
    process.exit(1);
  });
