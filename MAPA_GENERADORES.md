# 🗺️ Mapa de Generadores de Datos

## Flujo General

```
START
  ↓
┌─────────────────────────────────────────┐
│  ¿Qué necesitas hacer?                  │
└─────────────────────────────────────────┘
  ↓
  ├─ Empezar desde cero
  │   └─ npm run seed
  │       ├─ 5 usuarios creados ✅
  │       └─ 20 denuncias creadas ✅
  │
  ├─ Generar más denuncias
  │   └─ npm run create-denuncias
  │       └─ 20 denuncias adicionales ✅
  │
  ├─ Generar cantidad personalizada
  │   └─ node scripts/generateDenunciasAdvanced.js --cantidad 50
  │       └─ 50 denuncias (como especifiques) ✅
  │
  ├─ Generar solo cierta categoría
  │   └─ node scripts/generateDenunciasAdvanced.js --cantidad 30 --categoria "Agua Potable"
  │       └─ 30 denuncias de agua ✅
  │
  ├─ Generar solo cierta prioridad
  │   └─ node scripts/generateDenunciasAdvanced.js --cantidad 20 --prioridad Urgente
  │       └─ 20 denuncias urgentes ✅
  │
  └─ Limpiar datos
      └─ node scripts/cleanTestData.js
          └─ Elimina denuncias (con confirmación) ✅
```

---

## Matriz de Decisión

### ¿Cuál script debo usar?

| Escenario | Script | Comando |
|-----------|--------|---------|
| **Primera vez, todo desde cero** | ⭐ `createTestDenuncias.js` | `npm run seed` |
| **Agregar 20 más sin opciones** | 📝 `createTestDenuncias.js` | `npm run create-denuncias` |
| **Generar 50, 100, o N denuncias** | 🚀 `generateDenunciasAdvanced.js` | `--cantidad 50` |
| **Solo denuncias urgentes** | 🚀 `generateDenunciasAdvanced.js` | `--prioridad Urgente` |
| **Solo denuncias de agua** | 🚀 `generateDenunciasAdvanced.js` | `--categoria "Agua"` |
| **Combinación de filtros** | 🚀 `generateDenunciasAdvanced.js` | Múltiples opciones |
| **Limpiar todo** | 🧹 `cleanTestData.js` | sin opciones |
| **Ver todas las opciones** | 🚀 `generateDenunciasAdvanced.js` | `--help` |

---

## Opciones de generateDenunciasAdvanced.js

```
node scripts/generateDenunciasAdvanced.js [OPCIONES]

├─ --cantidad <número>
│  ├─ Default: 10
│  └─ Ejemplo: --cantidad 50
│
├─ --categoria <nombre>
│  ├─ Agua Potable, Alcantarillado Sanitario, Alcantarillado Pluvial
│  ├─ Recolección de Desechos y Saneamiento Ambiental
│  ├─ Movilidad Urbana: Bacheo de Calles, Frecuencias, ...
│  └─ Obstrucción de vías por construcciones, ornato, ...
│
├─ --estado <estado>
│  ├─ En revisión
│  ├─ En proceso
│  ├─ Atendida
│  └─ No procede
│
├─ --prioridad <nivel>
│  ├─ Baja
│  ├─ Media
│  ├─ Alta
│  └─ Urgente
│
├─ --usuario <id>
│  └─ ID de usuario específico
│
└─ --help / -h
   └─ Ver toda la documentación
```

---

## Ejemplos por Caso de Uso

### 🎬 Caso 1: Demo/Presentación

```bash
# Tu jefe quiere ver el sistema en acción
npm run seed
node scripts/generateDenunciasAdvanced.js --cantidad 100

# Resultado: 5 usuarios + 120 denuncias con datos variados
```

### 📊 Caso 2: Testing de Dashboards

```bash
# Necesitas datos variados para ver gráficos
npm run seed
node scripts/generateDenunciasAdvanced.js --cantidad 50
node scripts/generateDenunciasAdvanced.js --cantidad 30 --prioridad Urgente
node scripts/generateDenunciasAdvanced.js --cantidad 30 --estado "En proceso"

# Resultado: Mucho volumen de datos con variedad
```

### 🔍 Caso 3: Testing de Filtros

```bash
# Necesitas probar que los filtros funcionan correctamente

# Generar caso 1: Agua
node scripts/generateDenunciasAdvanced.js --cantidad 10 --categoria "Agua Potable"

# Generar caso 2: Desechos
node scripts/generateDenunciasAdvanced.js --cantidad 10 --categoria "Recolección de Desechos"

# Generar caso 3: Movilidad
node scripts/generateDenunciasAdvanced.js --cantidad 10 --categoria "Movilidad Urbana"

# Generar caso 4: Construcción
node scripts/generateDenunciasAdvanced.js --cantidad 10 --categoria "Obstrucción de vías"

# Resultado: Puedes probar que cada filtro funciona
```

### ⚠️ Caso 4: Testing de Estados

```bash
# Necesitas denuncias en diferentes estados

node scripts/generateDenunciasAdvanced.js --cantidad 10 --estado "En revisión"
node scripts/generateDenunciasAdvanced.js --cantidad 10 --estado "En proceso"
node scripts/generateDenunciasAdvanced.js --cantidad 10 --estado "Atendida"
node scripts/generateDenunciasAdvanced.js --cantidad 10 --estado "No procede"

# Resultado: 40 denuncias en diferentes estados
```

### 🎯 Caso 5: Testing de Prioridades

```bash
# Necesitas ver que el ordenamiento por prioridad funciona

node scripts/generateDenunciasAdvanced.js --cantidad 25 --prioridad Baja
node scripts/generateDenunciasAdvanced.js --cantidad 25 --prioridad Media
node scripts/generateDenunciasAdvanced.js --cantidad 25 --prioridad Alta
node scripts/generateDenunciasAdvanced.js --cantidad 25 --prioridad Urgente

# Resultado: 100 denuncias distribuidas por prioridad
```

### 🧹 Caso 6: Limpiar y Empezar de Nuevo

```bash
# Necesitas un reset completo

node scripts/cleanTestData.js --usuarios
# (Confirma cuando pregunte)

# Ahora vuelve a generar
npm run seed

# Resultado: Base de datos limpia, datos frescos
```

---

## Guía Visual: Cantidad de Datos

```
npm run seed
  └─ 125 denuncias
     ├─ Agua: ~31
     ├─ Desechos: ~31
     ├─ Movilidad: ~31
     └─ Construcción: ~31

+ node scripts/generateDenunciasAdvanced.js --cantidad 50
  └─ +50 denuncias (total: 175)

+ node scripts/generateDenunciasAdvanced.js --cantidad 100
  └─ +100 denuncias (total: 275)

+ node scripts/generateDenunciasAdvanced.js --cantidad 25 --prioridad Urgente
  └─ +25 denuncias urgentes (total: 300)
```

---

## Tabla de Tiempo de Ejecución

| Comando | Cantidad | Tiempo Estimado |
|---------|----------|-----------------|
| `npm run seed` | 20 denuncias | ~2-3 segundos |
| `--cantidad 50` | 50 denuncias | ~3-4 segundos |
| `--cantidad 100` | 100 denuncias | ~5-7 segundos |
| `--cantidad 500` | 500 denuncias | ~15-20 segundos |
| `cleanTestData.js` | Limpia todo | ~1-2 segundos |

---

## Comandos más Frecuentes

### Top 5 Comandos
```bash
# 1️⃣  Primera vez
npm run seed

# 2️⃣  Agregar más datos rápido
npm run create-denuncias

# 3️⃣  Cantidad personalizada
node scripts/generateDenunciasAdvanced.js --cantidad 50

# 4️⃣  Limpiar para empezar de nuevo
node scripts/cleanTestData.js --usuarios

# 5️⃣  Ver opciones disponibles
node scripts/generateDenunciasAdvanced.js --help
```

---

## Workflow Diario Típico

### Mañana: Iniciar sesión
```bash
npm run seed  # 2-3 segundos
```

### Durante el día: Si necesitas más datos
```bash
node scripts/generateDenunciasAdvanced.js --cantidad 50  # 3-4 segundos
```

### Tarde: Limpiar antes de ir a casa
```bash
node scripts/cleanTestData.js --usuarios  # 1-2 segundos
```

### Día siguiente: Empezar limpio
```bash
npm run seed  # 2-3 segundos
```

---

## Variables de Ambiente

Los scripts usan automáticamente:

```bash
# De .env (si existe)
MONGODB_URI=mongodb://localhost:27017/barrios

# O por defecto
mongodb://localhost:27017/barrios
```

---

## ☑️ Checklist de Opciones

```
generateDenunciasAdvanced.js

BÁSICAS:
├─ [x] --cantidad (números)
└─ [x] --help (ver opciones)

FILTROS:
├─ [x] --categoria (4 opciones)
├─ [x] --estado (4 opciones)
├─ [x] --prioridad (4 opciones)
└─ [x] --usuario (por ID)

AVANZADAS:
├─ [ ] Combinaciones múltiples
├─ [ ] Paginación
└─ [ ] Export a JSON
```

---

## 🎓 Ejemplos Completos Copy-Paste

```bash
# Solo copiar y pegar en tu terminal

# Demo completa
npm run seed && node scripts/generateDenunciasAdvanced.js --cantidad 50

# Prueba de categorías
node scripts/generateDenunciasAdvanced.js --cantidad 20 --categoria "Agua Potable, Alcantarillado Sanitario, Alcantarillado Pluvial"

# Prueba de urgencia
node scripts/generateDenunciasAdvanced.js --cantidad 30 --prioridad Urgente

# Ciclo completo: Limpiar > Generar > Ver datos > Limpiar
node scripts/cleanTestData.js --todo --confirm && npm run seed && echo "✅ Datos generados!" && node scripts/cleanTestData.js
```

---

## 📱 Comandos Alias (Opcional)

Agrega a tu `~/.zshrc` o `~/.bashrc`:

```bash
# Alias rápidos
alias seed="npm run seed"
alias denuncias="npm run create-denuncias"
alias gen-denu="node scripts/generateDenunciasAdvanced.js"
alias clean-denu="node scripts/cleanTestData.js"
alias gen-help="node scripts/generateDenunciasAdvanced.js --help"

# Uso:
# seed
# gen-denu --cantidad 100
# clean-denu --usuarios
# gen-help
```

---

## 🎯 Reglas de Oro

1. **Siempre empezar con:** `npm run seed`
2. **Para más datos:** `npm run create-denuncias` o `gen-denu --cantidad X`
3. **Limpiar cuando:** `cleanTestData.js`
4. **Ver opciones:** `--help`
5. **Nunca:** Usar en producción

---

Selecciona tu escenario y copia el comando correspondiente. ¡Listo! 🚀
