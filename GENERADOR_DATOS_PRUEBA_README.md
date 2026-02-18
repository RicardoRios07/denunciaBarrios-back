# 📊 Suite Completa de Generación de Datos de Prueba

## 📋 Resumen

Se ha creado una suite profesional y completa para generar, gestionar y limpiar datos de prueba realistas para tu sistema de denuncias ciudadanas.

---

## 🆕 Scripts Nuevos Creados

### 1. **createTestDenuncias.js** ✨
**Generador Estándar de Denuncias**

- ✅ Crea 5 usuarios automáticamente  
- ✅ Genera 20 denuncias realistas
- ✅ Distribuye denuncias entre usuarios
- ✅ Genera 4 categorías diferentes
- ✅ Incluye variedad de estados y prioridades
- ✅ Ubicaciones reales de Loja
- ✅ Descripciones realistas por categoría

**Comando:**
```bash
npm run create-denuncias
npm run seed  # Con usuarios incluidos
```

---

### 2. **generateDenunciasAdvanced.js** 🚀
**Generador Avanzado con Filtros Personalizables**

- ✅ Control de cantidad (`--cantidad 50`)
- ✅ Filtrar por categoría (`--categoria "Agua Potable"`)
- ✅ Filtrar por estado (`--estado "En proceso"`)
- ✅ Filtrar por prioridad (`--prioridad Urgente`)
- ✅ Generar para usuario específico (`--usuario ID`)
- ✅ Ver ayuda interativa (`--help`)

**Ejemplos:**
```bash
# 50 denuncias generales
node scripts/generateDenunciasAdvanced.js --cantidad 50

# 30 denuncias urgentes de agua
node scripts/generateDenunciasAdvanced.js --cantidad 30 --categoria "Agua Potable" --prioridad Urgente

# Ver todas las opciones
node scripts/generateDenunciasAdvanced.js --help
```

---

### 3. **cleanTestData.js** 🧹
**Herramienta de Limpieza de Datos**

- ✅ Elimina denuncias (por defecto)
- ✅ Elimina usuarios de prueba (con `--usuarios`)
- ✅ Limpia todo (con `--todo`)
- ✅ Pide confirmación antes de eliminar
- ✅ Muestra resumen antes y después
- ✅ Opción para ejecutar sin confirmar

**Comandos:**
```bash
# Solo limpiar denuncias
node scripts/cleanTestData.js

# Limpiar denuncias y usuarios de prueba
node scripts/cleanTestData.js --usuarios

# Limpiar TODO sin confirmar
node scripts/cleanTestData.js --todo --confirm
```

---

## 📚 Documentación Creada

### 1. **CREATE_DENUNCIAS_GUIDE.md**
Guía completa del script de denuncias con:
- Descripción detallada de datos generados
- Instrucciones de instalación
- Ejemplos de uso
- Credenciales de prueba
- Endpoints para testing
- Personalización del script
- Solución de problemas

### 2. **QUICK_REFERENCE.md**
Referencia rápida con:
- Comandos más usados
- Tabla de comparación de comandos
- Ejemplos prácticos por escenario
- Credenciales de prueba
- Endpoints útiles

### 3. **README.md** (Actualizado)
Documentación general de scripts con:
- Descripción de todos los scripts disponibles
- Nuevos comandos npm agregados
- Tablas de referencia

---

## 📦 Scripts NPM Actualizados

Se han agregado los siguientes comandos a `package.json`:

```json
{
  "scripts": {
    "create-denuncias": "node scripts/createTestDenuncias.js",
    "seed": "npm run create-users && npm run create-denuncias"
  }
}
```

**Comandos disponibles:**
| Comando | Qué hace |
|---------|----------|
| `npm run create-users` | Crea usuarios de prueba |
| `npm run create-admin` | Crea admin interactivamente |
| `npm run create-denuncias` | Crea 20 denuncias realistas |
| `npm run seed` | Crea usuarios + denuncias (RECOMENDADO) |

---

## 🚀 Guía Rápida de Inicio

### Opción 1: El Camino Fácil (Recomendado)
```bash
# Una sola línea para todo
npm run seed
```
✅ Crea 5 usuarios + 20 denuncias realistas

### Opción 2: Paso a Paso
```bash
# Crear usuarios primero
npm run create-users

# Luego crear denuncias
npm run create-denuncias
```

### Opción 3: Denuncias Personalizadas
```bash
# Generar 100 denuncias
node scripts/generateDenunciasAdvanced.js --cantidad 100

# O con más filtros
node scripts/generateDenunciasAdvanced.js --cantidad 50 --prioridad Urgente --estado "En proceso"
```

---

## 📊 Datos Que Se Generan

### Usuarios (5 total)
```
juan.perez@test.com
maria.lopez@test.com
carlos.gonzalez@test.com
ana.martinez@test.com
roberto.castro@test.com

(Todos con contraseña: usuario123)
```

### Denuncias (20 por default)
- **Categorías:** 4 tipos diferentes
- **Estados:** En revisión, En proceso, Atendida, No procede
- **Prioridades:** Baja, Media, Alta, Urgente
- **Ubicaciones:** 8 barrios diferentes de Loja
- **Imágenes:** URLs reales desde Unsplash
- **Descripciones:** Realistas según categoría

---

## 🔧 Características Principales

### ✨ Realismo
- Descripciones variadas y coherentes
- Imágenes reales (no hardcodeadas)
- Ubicaciones geográficas precisas
- Datos distribuidos naturalmente

### 🎯 Flexibilidad
- Cantidad personalizable
- Filtros por categoría, estado, prioridad
- Usuarios específicos
- Estados iniciales configurables

### 🧹 Mantenimiento
- Script de limpieza incluido
- Confirmación antes de eliminar
- Fácil de reproducir cambios

### 📝 Documentación
- 3 guías completas incluidas
- Ejemplos de uso extensos
- Solución de problemas
- Referencia rápida

---

## 🔄 Workflow Típico de Testing

```bash
# 1. Generar datos iniciales
npm run seed

# 2. Probar en los dashboards/API
# ... testing ...

# 3. Si necesitas más datos
node scripts/generateDenunciasAdvanced.js --cantidad 100

# 4. Cuando termines de probar
node scripts/cleanTestData.js --usuarios

# 5. Volver a empezar
npm run seed
```

---

## 🧪 Testing con los Datos

### Endpoints para probar
```bash
# Listar todas las denuncias
curl http://localhost:3085/denuncia

# Obtener estadísticas
curl http://localhost:3085/denuncia/stats/estado

# Denuncias por usuario
curl http://localhost:3085/denuncia/user/{userId}
```

### Dashboard Testing
- ✅ Ver gráficos con volumen real de datos
- ✅ Filtros por estado/categoría/prioridad
- ✅ Mapas con ubicaciones variadas
- ✅ Estadísticas por usuario

---

## 📋 Checklist de Uso

- [ ] Ejecutar `npm run seed` una vez
- [ ] Verificar que aparecen los datos en MongoDB
- [ ] Probar endpoints de denuncias
- [ ] Verificar dashboards se llenan con datos
- [ ] Si necesitas más: usar `generateDenunciasAdvanced.js`
- [ ] Cuando termines: usar `cleanTestData.js` para limpiar
- [ ] Volver a generar si necesitas empezar limpio

---

## 🎓 Ejemplos Prácticos

### Generar datos para demo
```bash
npm run seed
node scripts/generateDenunciasAdvanced.js --cantidad 50
```

### Testing de categorías específicas
```bash
node scripts/generateDenunciasAdvanced.js --cantidad 20 --categoria "Agua Potable, Alcantarillado Sanitario, Alcantarillado Pluvial"
```

### Testing de estados
```bash
node scripts/generateDenunciasAdvanced.js --cantidad 15 --estado "En revisión"
node scripts/generateDenunciasAdvanced.js --cantidad 15 --estado "En proceso"
node scripts/generateDenunciasAdvanced.js --cantidad 15 --estado "Atendida"
```

### Testing de prioridades altas
```bash
node scripts/generateDenunciasAdvanced.js --cantidad 25 --prioridad Alta
node scripts/generateDenunciasAdvanced.js --cantidad 25 --prioridad Urgente
```

---

## 🆘 Troubleshooting Rápido

| Problema | Solución |
|----------|----------|
| "connect ECONNREFUSED" | MongoDB no corre: `brew services start mongodb-community` |
| "Usuario ya existe" | Normal, detecta duplicados automáticamente |
| "No hay usuarios disponibles" | Ejecuta primero `npm run create-users` |
| Datos no aparecen en base | Verifica MONGODB_URI en .env |
| Script muy lento | Reduce --cantidad o divide en varios runs |

---

## 📁 Estructura de Archivos

```
scripts/
├── createTestDenuncias.js        ← Script estándar
├── generateDenunciasAdvanced.js  ← Script avanzado
├── cleanTestData.js              ← Limpieza
├── CREATE_DENUNCIAS_GUIDE.md     ← Guía completa
├── QUICK_REFERENCE.md            ← Referencia rápida
└── README.md                      ← Documentación general
```

---

## 🎉 ¡Listo para Usar!

Todo está configurado y listo. Solo ejecuta:

```bash
npm run seed
```

Y tendrás datos realistas para testing en tu sistema de denuncias ciudadanas.

---

## 📞 Notas Importantes

- ⚠️ Los scripts son solo para **desarrollo y testing**
- ⚠️ No usar en producción
- ⚠️ Los datos generados son **ficticios y de prueba**
- ✅ Todos los scripts generan **datos diferentes cada ejecución**
- ✅ Los datos son **completamente realistas**
- ✅ Incluyen **ubicaciones reales** de Loja

---

**¡Disfruta testando tu sistema! 🚀**

Para más información, ver:
- [CREATE_DENUNCIAS_GUIDE.md](./CREATE_DENUNCIAS_GUIDE.md) - Guía detallada
- [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) - Referencia rápida
- [README.md](./README.md) - Todos los scripts
