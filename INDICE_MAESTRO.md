# 📑 Índice Maestro - Generadores de Datos

> Última actualización: 18 de febrero de 2026

---

## 🎯 Usa Este Índice Para...

```
┌────────────────────────────────────────────────────────┐
│  BUSCO...                                              │
├────────────────────────────────────────────────────────┤
│  ✅ Empezar rápido         → QUICK_REFERENCE.md        │
│  ✅ Entender todo           → RESUMEN_ENTREGA.md       │
│  ✅ Ver flowchart visual    → MAPA_GENERADORES.md      │
│  ✅ Guía completa detallada → CREATE_DENUNCIAS_GUIDE.md│
│  ✅ Listar todos             → Este archivo            │
│  ✅ Opciones de scripts     → scripts/README.md        │
└────────────────────────────────────────────────────────┘
```

---

## 🗂️ Estructura de Documentación

```
denunciaBarrios-back/
│
├─ 📍 AQUÍ ESTÁS → (Índice Maestro)
│
├─ 🟢 RESUMEN_ENTREGA.md
│  ├─ Qué se entregó
│  ├─ Inicio rápido (30 seg)
│  ├─ Casos de uso
│  ├─ Matriz de decisión
│  └─ Próximos pasos
│
├─ 🟡 QUICK_REFERENCE.md
│  ├─ Comandos más usados
│  ├─ Copy-paste ready
│  ├─ Ejemplos prácticos
│  ├─ Tablas de referencia
│  └─ Troubleshooting
│
├─ 🟠 MAPA_GENERADORES.md
│  ├─ Flowcharts visuales
│  ├─ Matriz de decisión
│  ├─ Duración de ejecución
│  ├─ Casos de uso detallados
│  └─ Workflow diario
│
├─ 🔵 GENERADOR_DATOS_PRUEBA_README.md
│  ├─ Descripción general
│  ├─ Scripts creados
│  ├─ Documentación
│  ├─ Workflow de testing
│  └─ Ejemplos
│
├─ 📂 scripts/
│  ├─ 🟣 README.md
│  │  ├─ Todos los scripts
│  │  ├─ Instrucciones
│  │  ├─ Problemáticas
│  │  └─ Personalización
│  │
│  ├─ 🟤 CREATE_DENUNCIAS_GUIDE.md
│  │  ├─ Guía detallada
│  │  ├─ Credenciales
│  │  ├─ Endpoints
│  │  ├─ Próximos pasos
│  │  └─ FAQ
│  │
│  ├─ 🟥 QUICK_REFERENCE.md
│  │  ├─ Atajos rápidos
│  │  ├─ Ejemplos simples
│  │  ├─ Tablas
│  │  └─ Pro tips
│  │
│  ├─ 💜 createTestDenuncias.js
│  │  └─ Script estándar
│  │
│  ├─ 🌈 generateDenunciasAdvanced.js
│  │  └─ Script avanzado con filtros
│  │
│  └─ 🗑️ cleanTestData.js
│     └─ Script de limpieza
│
└─ 📦 package.json (actualizado)
   ├─ npm run create-denuncias
   └─ npm run seed
```

---

## 🎯 Selecciona Tu Perfil

### 👤 Perfil: "Quiero empezar AHORA"
**Lectura sugerida:** 30 segundos
```
1. Lee el primer párrafo de RESUMEN_ENTREGA.md
2. Ejecuta: npm run seed
3. ¡Listo!
```

### 👤 Perfil: "Quiero saber qué hacer"
**Lectura sugerida:** 2 minutos
```
1. Lee QUICK_REFERENCE.md (tabla de comandos)
2. Copia un comando
3. Pégalo en terminal
```

### 👤 Perfil: "Necesito entender todo"
**Lectura sugerida:** 10 minutos
```
1. Lee RESUMEN_ENTREGA.md (completo)
2. Lee MAPA_GENERADORES.md (visual)
3. Lee QUICK_REFERENCE.md (practica)
4. Consulta CREATE_DENUNCIAS_GUIDE.md si tienes dudas
```

### 👤 Perfil: "Soy desarrollador experimentado"
**Lectura sugerida:** 5 minutos
```
1. Revisa: scripts/generateDenunciasAdvanced.js (línea 1-50)
2. Ejecuta: node scripts/generateDenunciasAdvanced.js --help
3. Customiza según necesidades
```

---

## 📚 Guía de Lectura Recomendada

### 📖 Lectura Mínima (Empezar rápido)
1. ⏱️ **0-1 min:** Este archivo (índice)
2. ⏱️ **1-2 min:** Tabla de TU CÓMO en QUICK_REFERENCE.md
3. ⏱️ **2-3 min:** Ejecuta comando

### 📖 Lectura Estándar (Entender bien)
1. ⏱️ **0-3 min:** RESUMEN_ENTREGA.md (primeras 3 secciones)
2. ⏱️ **3-5 min:** MAPA_GENERADORES.md (primeira matriz)
3. ⏱️ **5-7 min:** QUICK_REFERENCE.md (comandos frecuentes)
4. ⏱️ **7-10 min:** Ejecuta y prueba

### 📖 Lectura Completa (Dominar todo)
1. ⏱️ **0-5 min:** RESUMEN_ENTREGA.md (completo)
2. ⏱️ **5-10 min:** MAPA_GENERADORES.md (completo)
3. ⏱️ **10-15 min:** QUICK_REFERENCE.md (todo incluye pro tips)
4. ⏱️ **15-20 min:** GENERADOR_DATOS_PRUEBA_README.md
5. ⏱️ **20-30 min:** CREATE_DENUNCIAS_GUIDE.md (detallado)
6. ⏱️ **30+ min:** scripts/README.md (referencia)

---

## 🔍 Buscar por Tema

### "¿Cómo empiezo?"
- 🟢 RESUMEN_ENTREGA.md → Inicio Rápido
- 🟡 QUICK_REFERENCE.md → Primera sección
- 🟠 MAPA_GENERADORES.md → Caso 1

### "¿Qué comando uso?"
- 🟡 QUICK_REFERENCE.md → Comandos Más Utilizados
- 🟠 MAPA_GENERADORES.md → Matriz de Decisión
- 🔵 GENERADOR_DATOS_PRUEBA_README.md → Guía Rápida

### "¿Cómo personalizo?"
- 🟠 MAPA_GENERADORES.md → Opciones de generateDenunciasAdvanced.js
- 🟤 CREATE_DENUNCIAS_GUIDE.md → Personalización
- 🟣 scripts/README.md → Personalización

### "¿Tengo un problema?"
- 🟤 CREATE_DENUNCIAS_GUIDE.md → Solución de Problemas
- 🟡 QUICK_REFERENCE.md → Troubleshooting Rápido
- 🟣 scripts/README.md → Problemas Comunes

### "¿Cómo limpio datos?"
- 🟠 MAPA_GENERADORES.md → Caso 6: Limpiar
- 🟡 QUICK_REFERENCE.md → Comandos
- 🟣 scripts/README.md → cleanTestData.js

### "¿Cuál es el flujo completo?"
- 🟠 MAPA_GENERADORES.md → Flujo General (top)
- 🔵 GENERADOR_DATOS_PRUEBA_README.md → Workflow
- 🟡 QUICK_REFERENCE.md → Workflow Diario

### "¿Ver ejemplos?"
- 🟡 QUICK_REFERENCE.md → Ejemplos Prácticos
- 🟠 MAPA_GENERADORES.md → Ejemplos por Caso de Uso
- 🟤 CREATE_DENUNCIAS_GUIDE.md → FAQs

---

## 🎯 Tablas de Referencia Rápida

### Archivo → Contenido Clave
| Archivo | Mejor Para | Lectura|
|---------|-----------|--------|
| RESUMEN_ENTREGA.md | Entender qué se hizo | 3 min |
| QUICK_REFERENCE.md | Comandos rápidos | 2 min |
| MAPA_GENERADORES.md | Decisiones visuales | 5 min |
| CREATE_DENUNCIAS_GUIDE.md | Documentación completa | 10 min |
| GENERADOR_DATOS_PRUEBA_README.md | Overview general | 5 min |
| scripts/README.md | Todos los scripts | 10 min |

### Tipo de Usuario → Documento Recomendado
| Usuario | Documento | Tiempo |
|---------|-----------|--------|
| "Quiero comenzar YA" | QUICK_REFERENCE.md | 1 min |
| "Quiero entender" | RESUMEN_ENTREGA.md | 5 min |
| "Necesito ejemplos" | MAPA_GENERADORES.md | 5 min |
| "Necesito todo" | CREATE_DENUNCIAS_GUIDE.md | 20 min |

---

## 📍 Navegación Referencias Cruzadas

```
Si lees...                  Ve también...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RESUMEN_ENTREGA.md    → QUICK_REFERENCE.md (comandos)
QUICK_REFERENCE.md    → MAPA_GENERADORES.md (flowchart)
MAPA_GENERADORES.md   → CREATE_DENUNCIAS_GUIDE.md (detalles)
CREATE_DENUNCIAS_GUIDE → scripts/README.md (ref técnica)
/GENERADOR_DATOS      → Todos los anteriores (overview)
scripts/README.md     → Este índice (navegación)
```

---

## ⌨️ Comandos Principales Rápidos

```bash
# Copiar y ejecutar directamente:

npm run seed                    # 🟢 Empezar
npm run create-denuncias        # 🟡 Más datos
node scripts/generateDenunciasAdvanced.js --cantidad 50  # 🟠 Personalizado
node scripts/cleanTestData.js --usuarios                 # 🔴 Limpiar
node scripts/generateDenunciasAdvanced.js --help         # 🔵 Ver opciones
```

---

## 🎓 Plan de Aprendizaje en Pasos

### Paso 1: Conocimiento Básico (5 min)
```
1. Abre RESUMEN_ENTREGA.md
2. Lee hasta la sección "Inicio Rápido"
3. Ejecuta: npm run seed
```

### Paso 2: Practica (10 min)
```
1. Abre QUICK_REFERENCE.md
2. Prueba 3 comandos diferentes
3. Verifica datos en MongoDB
```

### Paso 3: Comprensión (15 min)
```
1. Abre MAPA_GENERADORES.md
2. Entiende el flowchart
3. Prueba casos de uso diferentes
```

### Paso 4: Dominio (30 min)
```
1. Lee CREATE_DENUNCIAS_GUIDE.md
2. Explora scripts/generateDenunciasAdvanced.js
3. Personaliza para tu caso de uso
```

---

## 📞 Ayuda Rápida: Preguntas Comunes

| Pregunta | Respuesta | Documento |
|----------|-----------|----------|
| ¿Ejecut + cómo empiezo? | `npm run seed` | QUICK_REFERENCE |
| ¿Qué dados genera? | 5 users + 20 denuncias | RESUMEN_ENTREGA |
| ¿Cuánto tiempo toma? | 2-3 segundos | MAPA_GENERADORES |
| ¿Posso personalizar? | Sí, con --opciones | CREATE_DENUNCIAS_GUIDE |
| ¿Cómo limpio? | `cleanTestData.js` | QUICK_REFERENCE |
| ¿Qué users se crean? | Ver tabla | QUICK_REFERENCE |
| ¿MongoDB no conecta? | Solución en FAQ | CREATE_DENUNCIAS_GUIDE |
| ¿Cómo genero solo X? | --cantidad 10 | MAPA_GENERADORES |

---

## 🔗 Archivos Directos (Links)

### Documentación
- 📄 [RESUMEN_ENTREGA.md](./RESUMEN_ENTREGA.md) - Ejecutivo
- 📄 [QUICK_REFERENCE.md](./scripts/QUICK_REFERENCE.md) - Rápido
- 📄 [MAPA_GENERADORES.md](./MAPA_GENERADORES.md) - Visual
- 📄 [GENERADOR_DATOS_PRUEBA_README.md](./GENERADOR_DATOS_PRUEBA_README.md) - Overview
- 📄 [scripts/CREATE_DENUNCIAS_GUIDE.md](./scripts/CREATE_DENUNCIAS_GUIDE.md) - Completo
- 📄 [scripts/README.md](./scripts/README.md) - Técnico

### Scripts
- 🟣 [createTestDenuncias.js](./scripts/createTestDenuncias.js) - Estándar
- 🌈 [generateDenunciasAdvanced.js](./scripts/generateDenunciasAdvanced.js) - Avanzado
- 🗑️ [cleanTestData.js](./scripts/cleanTestData.js) - Limpieza

### Configuración
- ⚙️ [package.json](./package.json) - Scripts npm

---

## 🎉 ¡Comienza Aquí!

```
1. ¿Prisa? ........................... QUICK_REFERENCE.md
2. ¿Nuevo? ........................... RESUMEN_ENTREGA.md
3. ¿Visual? .......................... MAPA_GENERADORES.md
4. ¿Todos detalle? ................... CREATE_DENUNCIAS_GUIDE.md
5. ¿Código? .......................... scripts/generateDenunciasAdvanced.js
```

---

## 📞 Llamada a Acción

**Si tienes muy poco tiempo:**
```bash
npm run seed
# ¡Listo en 3 segundos!
```

**Si quieres aprender:**
Haz clic en cualquier QUICK_REFERENCE.md y sigue los ejemplos.

**Si necesitas ayuda:**
1. Busca el tema en la sección "Buscar por Tema" de este índice
2. Abre el archivo recomendado
3. Encuentra tu respuesta

---

## ✅ Checklist de Navegación

- [ ] Encontré este índice ✅
- [ ] Entiendé qué archivo leer
- [ ] Empecé con el recomendado
- [ ] Ejecuté un comando
- [ ] Vi los datos generados
- [ ] Probé otro comando
- [ ] ¡Ahora soy experto! 🎉

---

**Versión:** 1.0
**Actualizado:** 18 de febrero de 2026
**Estado:** ✅ Completo

¡Que disfrutes generando datos de prueba! 🚀
