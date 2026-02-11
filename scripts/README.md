# � Scripts de Utilidad

Este directorio contiene scripts útiles para desarrollo, testing y mantenimiento de la aplicación.

## 📜 Scripts Disponibles

### 1. � Creación de Administrador
**Archivo:** `createAdmin.js`

Script interactivo para crear administradores del sistema de forma segura.

**Ejecutar con:**
```bash
npm run create-admin
```
o directamente:
```bash
node scripts/createAdmin.js
```

**Características:**
- ✅ Interfaz interactiva para ingresar datos
- ✅ Validación de email y contraseña
- ✅ Verificación de duplicados
- ✅ Encriptación segura de contraseñas
- ✅ Administrador verificado automáticamente

**Uso:**
1. Ejecuta el script
2. Ingresa el nombre completo del administrador
3. Proporciona un email válido
4. Establece una contraseña (mínimo 6 caracteres)
5. Confirma la contraseña
6. ¡Listo! El administrador está creado y puede iniciar sesión

---

### 2. �👥 Creación de Usuarios de Prueba
**Archivo:** `createTestUsers.js`

Este script crea automáticamente usuarios de prueba para desarrollo y testing de la API.

## 🎯 Usuarios Creados

### 📱 Usuario Normal
- **Email:** `usuario@test.com`
- **Password:** `usuario123`
- **Nombre:** Juan Pérez García
- **Cédula:** 1234567890
- **Teléfono:** 0987654321
- **Estado:** Verificado y activo

### 👨‍💼 Administrador
- **Email:** `admin@test.com`
- **Password:** `admin123`
- **Nombre:** Admin Principal
- **Estado:** Verificado y activo

---

### 2. 👷 Creación de Personal Municipal de Prueba
**Archivo:** `createTestPersonal.js`

Crea personal municipal de prueba para diferentes departamentos.

**Ejecutar con:**
```bash
node scripts/createTestPersonal.js
```

**Personal creado:**
- 8 funcionarios de diferentes departamentos
- Incluye: inspectores, técnicos, ingenieros, coordinadores
- Departamentos: Obras Públicas, Gestión Ambiental, Agua y Alcantarillado, Control Urbano

---

### 3. 🔄 Migración de Denuncias (Nuevos Campos)
**Archivo:** `migrateDenunciasNuevosCampos.js`

Actualiza denuncias existentes con los nuevos campos implementados (prioridad, historial, etc.)

**Ejecutar con:**
```bash
node scripts/migrateDenunciasNuevosCampos.js
```

**Funciones:**
- Agrega campo de prioridad (default: 'Media')
- Crea historial inicial de estados
- Muestra estadísticas de migración
- No duplica datos ya existentes

---

### 4. 📍 Migración de Ubicación
**Archivo:** `migrateUbicacion.js`

Migra el formato de ubicación en denuncias existentes.

---

## 🚀 Uso del Script

### Opción 1: Con npm (Recomendado)
```bash
npm run create-users
```
o también:
```bash
npm run seed
```

### Opción 2: Con Node directamente
```bash
node scripts/createTestUsers.js
```

## 📋 Prerequisitos

1. MongoDB debe estar corriendo
2. Las variables de entorno deben estar configuradas en `.env`
3. Las dependencias deben estar instaladas (`npm install`)

## ✨ Características

- ✅ Verifica si los usuarios ya existen antes de crearlos
- ✅ Encripta las contraseñas con bcrypt
- ✅ Muestra mensajes informativos con colores
- ✅ Proporciona credenciales listas para usar
- ✅ Cierra la conexión automáticamente al terminar
- ✅ Manejo de errores robusto

## 📝 Salida del Script

El script mostrará:
```
🚀 INICIANDO CREACIÓN DE USUARIOS DE PRUEBA

✓ Conectado a MongoDB

ℹ Creando usuario normal...
✓ Usuario normal creado exitosamente
  Email: usuario@test.com
  Password: usuario123
  ID: 507f1f77bcf86cd799439011

ℹ Creando administrador...
✓ Administrador creado exitosamente
  Email: admin@test.com
  Password: admin123
  ID: 507f191e810c19729de860ea

═══════════════════════════════════════════════════
         USUARIOS DE PRUEBA CREADOS                
═══════════════════════════════════════════════════

📱 USUARIO NORMAL:
   Email:     usuario@test.com
   Password:  usuario123
   Cédula:    1234567890
   Teléfono:  0987654321

👨‍💼 ADMINISTRADOR:
   Email:     admin@test.com
   Password:  admin123

🔐 ENDPOINTS PARA PROBAR:
   Login Usuario: POST http://localhost:3085/auth/login
   Login Admin:   POST http://localhost:3085/admin/loginAdmin

✓ Proceso completado exitosamente
```

## 🧪 Probando los Usuarios

### Probar Usuario Normal

**Con curl:**
```bash
curl -X POST http://localhost:3085/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "usuario@test.com",
    "password": "usuario123"
  }'
```

**Con JavaScript/Fetch:**
```javascript
const response = await fetch('http://localhost:3085/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'usuario@test.com',
    password: 'usuario123'
  })
});
const data = await response.json();
console.log('Token:', data.data.token);
```

### Probar Administrador

**Con curl:**
```bash
curl -X POST http://localhost:3085/admin/loginAdmin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@test.com",
    "password": "admin123"
  }'
```

**Con JavaScript/Fetch:**
```javascript
const response = await fetch('http://localhost:3085/admin/loginAdmin', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'admin@test.com',
    password: 'admin123'
  })
});
const data = await response.json();
console.log('Admin Token:', data.data.token);
```

## 🔄 Ejecutar Múltiples Veces

Si ejecutas el script varias veces:
- No creará usuarios duplicados
- Mostrará una advertencia si ya existen
- Mostrará el ID del usuario existente

## 🛠️ Personalización

Para cambiar las credenciales de los usuarios de prueba, edita el archivo:
```
scripts/createTestUsers.js
```

Modifica las constantes:
```javascript
const usuarioNormal = {
    nombreCompleto: 'Tu Nombre',
    cedula: '1234567890',
    numTelefono: '0987654321',
    email: 'tuemail@test.com',
    password: 'tupassword',
    // ...
};

const usuarioAdmin = {
    nombreCompleto: 'Admin Nombre',
    email: 'tuadmin@test.com',
    password: 'adminpass',
    // ...
};
```

## 🐛 Solución de Problemas

### Error: MongoDB no está corriendo
```
✗ Error al conectar a MongoDB: connect ECONNREFUSED
```
**Solución:** Inicia MongoDB primero

### Error: Usuario ya existe
```
⚠ Usuario normal ya existe: usuario@test.com
```
**Solución:** Esto es normal. El script detectó que el usuario ya existe y no lo duplica.

### Error: Variables de entorno faltantes
**Solución:** Asegúrate de tener el archivo `.env` configurado correctamente

## 📚 Uso en Tests

Puedes importar las funciones del script en tus tests:

```javascript
const { crearUsuarioNormal, crearAdministrador } = require('./scripts/createTestUsers');

describe('Tests de API', () => {
  beforeAll(async () => {
    await crearUsuarioNormal();
    await crearAdministrador();
  });
  
  // Tus tests aquí...
});
```

## 🔐 Seguridad

⚠️ **IMPORTANTE:** 
- Este script es SOLO para desarrollo y testing
- NO uses estas credenciales en producción
- Las contraseñas están en texto plano en el script por conveniencia de desarrollo
- En producción, usa variables de entorno seguras

## 📋 Checklist Post-Creación

Después de ejecutar el script:
- [ ] Verifica que puedes hacer login con el usuario normal
- [ ] Verifica que puedes hacer login con el administrador
- [ ] Guarda los tokens JWT que recibes
- [ ] Prueba los endpoints protegidos con los tokens
- [ ] Verifica los permisos de administrador

---

**Autor:** Ricardo  
**Fecha:** Enero 2026  
**Versión:** 1.0.0
