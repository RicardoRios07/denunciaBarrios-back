# 📋 Script de Generación de Datos de Prueba

## Descripción General

El script `createTestDenuncias.js` te permite generar datos realistas y variados para pruebas de tu sistema de denuncias. Crea:

- **5 usuarios diferentes** con perfiles variados
- **20 denuncias realistas** con:
  - Múltiples categorías
  - Diferentes estados (En revisión, En proceso, Atendida, No procede)
  - Diferentes prioridades (Baja, Media, Alta, Urgente)
  - Ubicaciones geográficas dentro de Loja
  - Descripciones detalladas y relevantes
  - Imágenes de evidencia reales (desde Unsplash)
  - Fechas distribuidas en los últimos 30 días

---

## 📥 Instalación

No requiere dependencias adicionales. El script usa las mismas que ya está usando tu proyecto.

---

## 🚀 Uso

### Opción 1: Usar npm script (Recomendado)

```bash
# Solo crear denuncias (requiere usuarios existentes)
npm run create-denuncias

# Crear usuarios Y denuncias
npm run seed
```

### Opción 2: Ejecutar directamente con Node

```bash
# Solo denuncias
node scripts/createTestDenuncias.js

# O si prefieres
npx node scripts/createTestDenuncias.js
```

---

## 📊 Qué Genera

### Usuarios Creados

El script crea 5 usuarios con perfiles realistas:

| Nombre | Email | Denuncia |
|--------|-------|----------|
| Juan Pérez García | juan.perez@test.com | ~4 denuncias |
| María López Rodríguez | maria.lopez@test.com | ~4 denuncias |
| Carlos González Martínez | carlos.gonzalez@test.com | ~4 denuncias |
| Ana Martínez Jiménez | ana.martinez@test.com | ~4 denuncias |
| Roberto Castro Valencia | roberto.castro@test.com | ~4 denuncias |

**Contraseña para todos:** `usuario123`

### Denuncias Generadas

#### Por Categoría:
- **Agua Potable, Alcantarillado Sanitario, Alcantarillado Pluvial** (~5)
  - Tubos rotos, fugas, contaminación de agua
  
- **Recolección de Desechos y Saneamiento Ambiental** (~5)
  - Acumulación de basura, vertederos ilegales
  
- **Movilidad Urbana** (~5)
  - Baches, obstrucciones, falta de buses
  
- **Obstrucción de vías por construcciones** (~5)
  - Construcciones ilegales, escombros, permisos vencidos

#### Por Estado:
- En revisión
- En proceso
- Atendida
- No procede

#### Por Prioridad:
- Baja
- Media
- Alta
- Urgente

---

## 🔧 Características Especiales

### ✨ Datos Realistas

- **Descripciones detalladas** que varían según la categoría
- **Imágenes de evidencia reales** desde Unsplash (no hardcodeadas)
- **Ubicaciones geográficas reales** de Loja, Ecuador
- **Fechas variadas** distribuidas en los últimos 30 días

### 🔄 Idempotente

- Si ejecutas el script múltiples veces:
  - Los usuarios existentes **no se duplican**
  - Las denuncias se crean nuevamente (puedes limpiar e reintentar)

### 📱 Salida Colorida

El script proporciona feedback visual detallado:
- ✓ Confirmaciones en verde
- ✗ Errores en rojo
- ℹ Información en azul
- ⚠ Advertencias en amarillo

---

## 💾 Conexión a Base de Datos

El script usa automáticamente:

1. **Variable de entorno**: `MONGODB_URI` (si existe en `.env`)
2. **URL por defecto**: `mongodb://localhost:27017/barrios`

Asegúrate de tener MongoDB corriendo antes de ejecutar.

---

## 🧪 Probando con Postman

Una vez creados los datos, puedes probar estos endpoints:

### Listar todas las denuncias
```
GET http://localhost:3085/denuncia
```

### Obtener una denuncia específica
```
GET http://localhost:3085/denuncia/{id}
```

### Obtener denuncias de un usuario
```
GET http://localhost:3085/denuncia/user/{userId}
```

### Crear una nueva denuncia (requiere autenticación)
```
POST http://localhost:3085/denuncia
Content-Type: application/json

{
  "tituloDenuncia": "Mi denuncia",
  "descripcion": "Descripción detallada",
  "evidencia": "https://...",
  "ubicacion": {
    "type": "Point",
    "coordinates": [-79.2050, -3.9899]
  },
  "categoria": "Agua Potable, Alcantarillado Sanitario, Alcantarillado Pluvial"
}
```

---

## 🔐 Credenciales para Testing

Después de ejecutar el script, verás algo como:

```
👥 USUARIOS CREADOS: 5
📋 DENUNCIAS CREADAS: 20

🔐 CREDENCIALES DE PRUEBA:

   Usuario 1:
   Email:    juan.perez@test.com
   Password: usuario123

   Usuario 2:
   Email:    maria.lopez@test.com
   Password: usuario123

   ... (y más)
```

Usa estas credenciales para:

1. **Login en la app frontend**
2. **Testing de API endpoints**
3. **Verificación de dashboards**

---

## 🐛 Solución de Problemas

### "Error: connect ECONNREFUSED 127.0.0.1:27017"
- MongoDB no está corriendo
- Solución: `brew services start mongodb-community` (en macOS)

### "MongooseError: Model.findOne() no longer..."
- Problema con versión de Mongoose
- Solución: Verificar que mongoose ^7.3.1 está instalado

### Usuarios ya existen pero no se crean denuncias
- Verifica que los usuarios tienen `_id` válido
- El script necesita usuarios existentes para crear denuncias

### Las denuncias no aparecen en las consultas
- Verifica que MongoDB está usando la base de datos correcta: `barrios`
- Revisa los logs del script para errores específicos

---

## 📝 Personalización

### Cambiar cantidad de denuncias

En `createTestDenuncias.js`, línea ~230:
```javascript
const totalDenuncias = 20; // Cambia este número
```

### Cambiar ubicaciones

Modifica el array `ubicacionesLoja` para agregar más ubicaciones o cambiar coordenadas:

```javascript
const ubicacionesLoja = [
    { coords: [-79.2050, -3.9899], barrio: 'Tu Barrio' },
    // ... más ubicaciones
];
```

### Cambiar usuarios

Modifica el array `usuariosTest` para cambiar nombres, emails, etc.

---

## 📚 Comandos Útiles

```bash
# Ver todas las denuncias en la consola
npm run create-denuncias

# Usar con seeds anteriores
npm run seed

# Ver el contenido del script
cat scripts/createTestDenuncias.js

# Ejecutar con variables personalizadas
MONGODB_URI="mongodb://localhost:27017/test" npm run create-denuncias
```

---

## 🎯 Próximos Pasos

Con los datos listos:

1. ✅ **Visualizar en dashboards** - Revisa que los gráficos se llenen
2. ✅ **Testest filtros** - Prueba filtrar por categoría, estado, prioridad
3. ✅ **Verificar mapas** - Comprueba que las ubicaciones aparecen correctamente
4. ✅ **Testing funcional** - Prueba asignaciones, cambios de estado, etc.

---

## ❓ Preguntas Frecuentes

**P: ¿Puedo modificar las descripciones de denuncias?**
R: Sí, edita el objeto `descripciones` en el script

**P: ¿Cómo agrego más categorías?**
R: Extiende el objeto `categoriasYTitulos` con nuevas claves y valores

**P: ¿Se guardan las imágenes localmente?**
R: No, se usan URLs directas desde Unsplash (requiere internet)

**P: ¿Puedo usar este script en producción?**
R: No está recomendado. Úsalo solo en desarrollo/testing

---

## 📞 Soporte

Si encuentras problemas:

1. Revisa que MongoDB esté corriendo
2. Verifica que las variables de entorno están configuradas
3. Comprueba que los modelos están importados correctamente
4. Revisa los logs de error en la consola

Happy testing! 🎉
