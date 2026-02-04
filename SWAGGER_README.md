# 📘 Documentación API - Denuncias en Barrios

## 🎯 Descripción

Este proyecto cuenta con documentación completa de la API utilizando **OpenAPI 3.0** (Swagger). La documentación incluye todos los endpoints, modelos, esquemas de autenticación y respuestas del sistema.

## 📋 Contenido de la Documentación

La documentación cubre:

- ✅ **Autenticación (Auth)**: Login, registro, recuperación de contraseña, verificación de usuarios
- ✅ **Denuncias**: CRUD completo de denuncias ciudadanas con geolocalización
- ✅ **Administrador**: Gestión de usuarios, denuncias y administradores
- ✅ **Usuario**: Perfil de usuario y datos personales
- ✅ **Dashboard**: Estadísticas y métricas del sistema
- ✅ **Modelos**: User, Admin, Denuncia con todos sus campos
- ✅ **Esquemas de Seguridad**: JWT Bearer Auth y Admin Auth

## 🚀 Acceso a la Documentación

### 1. Documentación Interactiva (Swagger UI)

Una vez que el servidor esté corriendo, accede a:

```
http://localhost:3085/api-docs
```

Esta interfaz te permite:
- 📖 Explorar todos los endpoints
- 🧪 Probar las APIs directamente desde el navegador
- 📝 Ver ejemplos de request/response
- 🔐 Autenticarte con tokens JWT

### 2. Archivo OpenAPI JSON

El archivo `openapi.json` en la raíz del proyecto contiene toda la especificación en formato JSON. Puedes:

**Descargarlo directamente del servidor:**
```bash
curl http://localhost:3085/api-docs.json -o openapi.json
```

**O usarlo desde el proyecto:**
```
/openapi.json
```

## 💻 Uso del Archivo OpenAPI.json

### Para Agentes de IA/Código

El archivo `openapi.json` es ideal para que agentes de código (como Cursor, Copilot, ChatGPT, etc.) entiendan la estructura completa de tu API:

```bash
# Proporciona el archivo al agente con este prompt:
"Lee el archivo openapi.json y genera el código de integración para el frontend de esta API"
```

### Para Generación de Código Cliente

Puedes usar herramientas como `openapi-generator` para generar código cliente automáticamente:

**JavaScript/TypeScript:**
```bash
npm install @openapitools/openapi-generator-cli -g

openapi-generator-cli generate \
  -i openapi.json \
  -g typescript-axios \
  -o ./frontend/src/api
```

**Python:**
```bash
openapi-generator-cli generate \
  -i openapi.json \
  -g python \
  -o ./python-client
```

**Otros lenguajes:** Java, Go, Ruby, PHP, etc. Ver [lista completa](https://openapi-generator.tech/docs/generators/)

### Para Importar en Postman

1. Abre Postman
2. Click en "Import"
3. Selecciona el archivo `openapi.json`
4. Postman creará automáticamente toda la colección con todos los endpoints

### Para Importar en Insomnia

1. Abre Insomnia
2. Click en "Create" → "Import From" → "File"
3. Selecciona `openapi.json`
4. Todos los endpoints estarán listos para usar

## 🔧 Regenerar la Documentación

Si realizas cambios en la API, regenera el archivo con:

```bash
# 1. Asegúrate de que el servidor esté corriendo
npm start

# 2. En otra terminal, descarga el nuevo archivo
curl http://localhost:3085/api-docs.json -o openapi.json
```

## 📦 Estructura de la Documentación

```
src/
├── swagger/
│   └── schemas.js              # Esquemas comunes (StandardResponse, ErrorResponse, etc.)
├── Models/
│   ├── user.js                 # @swagger docs para modelo User
│   ├── admin.js                # @swagger docs para modelo Admin
│   └── denuncia.js             # @swagger docs para modelo Denuncia
└── Routes/
    ├── Authentication/         # Docs de rutas de autenticación
    ├── denunciaRoutes/         # Docs de rutas de denuncias
    ├── adminRoutes/            # Docs de rutas de administrador
    ├── userRoutes/             # Docs de rutas de usuario
    └── dashboardRoutes.js      # Docs de dashboard
```

## 🔐 Autenticación en la Documentación

La API utiliza dos esquemas de autenticación:

### 1. Bearer Auth (Usuario)
- **Header:** `Authorization: Bearer <token>`
- Usado en endpoints de: `/denuncias/*`, `/user/*`

### 2. Admin Auth
- **Header:** `auth-admin: <token>`
- Usado en endpoints de: `/admin/*`, `/admin/dashboard/*`

**Para probar en Swagger UI:**
1. Primero llama a `/auth/login` o `/admin/loginAdmin`
2. Copia el token de la respuesta
3. Click en el botón "Authorize" 🔒
4. Pega el token
5. Ahora puedes probar los endpoints protegidos

## 📊 Endpoints Principales

### Autenticación
- `POST /auth/register` - Registrar usuario
- `POST /auth/login` - Iniciar sesión
- `POST /auth/passwordRecovery` - Recuperar contraseña
- `POST /auth/newPassword` - Establecer nueva contraseña
- `POST /auth/verifyUser/:token` - Verificar cuenta

### Denuncias (Requiere autenticación)
- `GET /denuncias/getAllDenuncias` - Listar todas las denuncias
- `GET /denuncias/getDenunciasUser` - Denuncias del usuario actual
- `POST /denuncias/nuevaDenuncia` - Crear nueva denuncia
- `POST /denuncias/getDetailDenuncia` - Ver detalles de una denuncia
- `POST /denuncias/eliminarDenuncia` - Eliminar denuncia

### Administrador (Requiere auth admin)
- `POST /admin/loginAdmin` - Login de administrador
- `POST /admin/getAllUsers` - Listar todos los usuarios
- `POST /admin/getAllDenuncias` - Listar todas las denuncias
- `POST /admin/estadoDenuncia` - Cambiar estado de denuncia
- `POST /admin/changeStatusUser` - Bloquear/desbloquear usuario
- `POST /admin/addAdmin` - Agregar nuevo administrador

### Usuario (Requiere autenticación)
- `GET /user/getDetailUser` - Obtener perfil de usuario

### Dashboard (Requiere auth admin)
- `POST /admin/dashboard/getUsersCount` - Obtener conteo de usuarios

## 🌐 Integración con Frontend

### Ejemplo con Axios (JavaScript/TypeScript)

```typescript
import axios from 'axios';

// Configuración base
const api = axios.create({
  baseURL: 'http://localhost:3085',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para agregar token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Ejemplo de uso
async function login(email: string, password: string) {
  const response = await api.post('/auth/login', { email, password });
  localStorage.setItem('token', response.data.data.token);
  return response.data;
}

async function getDenuncias() {
  const response = await api.get('/denuncias/getAllDenuncias');
  return response.data.data;
}
```

### Ejemplo con Fetch (JavaScript)

```javascript
// Login
async function login(email, password) {
  const response = await fetch('http://localhost:3085/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await response.json();
  localStorage.setItem('token', data.data.token);
  return data;
}

// Obtener denuncias
async function getDenuncias() {
  const token = localStorage.getItem('token');
  const response = await fetch('http://localhost:3085/denuncias/getAllDenuncias', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return await response.json();
}
```

## 🤖 Prompt para Agentes de IA

Si estás usando un agente de IA para generar código frontend, usa este prompt:

```
He adjuntado el archivo openapi.json de mi API backend. Por favor:

1. Genera un servicio completo de API client para React/Vue/Angular
2. Incluye:
   - Configuración de axios/fetch con interceptors
   - Manejo de tokens JWT
   - Tipado TypeScript completo basado en los schemas
   - Manejo de errores estandarizado
   - Funciones para todos los endpoints
3. Usa los schemas del openapi.json para generar interfaces TypeScript
4. Implementa refresh token si es necesario
```

## 📝 Notas Importantes

- El servidor debe estar corriendo en `http://localhost:3085` (o el puerto configurado en `.env`)
- Todos los endpoints que requieren autenticación devuelven `401` si el token es inválido
- Las respuestas siguen un formato estandarizado con `code`, `status`, `message` y `data`
- Los archivos multipart/form-data se usan para upload de imágenes (registro de usuario y crear denuncia)

## 🐛 Troubleshooting

**Problema:** No puedo acceder a /api-docs
- Verifica que el servidor esté corriendo: `npm start`
- Revisa que el puerto 3085 esté disponible
- Verifica la configuración en `index.js`

**Problema:** El archivo openapi.json no se genera
- Asegúrate de que el servidor esté completamente iniciado
- Intenta acceder primero a http://localhost:3085/api-docs
- Ejecuta: `curl http://localhost:3085/api-docs.json -o openapi.json`

**Problema:** Los tokens no funcionan en Swagger UI
- Asegúrate de incluir el token completo sin "Bearer" al usar el botón Authorize
- Swagger UI agrega automáticamente el prefijo "Bearer"

## 📚 Recursos Adicionales

- [OpenAPI Specification](https://swagger.io/specification/)
- [Swagger UI](https://swagger.io/tools/swagger-ui/)
- [OpenAPI Generator](https://openapi-generator.tech/)
- [Postman OpenAPI Import](https://learning.postman.com/docs/getting-started/importing-and-exporting-data/)

---

**Autor:** Ricardo  
**Fecha:** Enero 2026  
**Versión de la API:** 1.0.0
