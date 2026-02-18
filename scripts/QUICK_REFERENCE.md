# ⚡ Referencia Rápida - Generación de Datos de Prueba

## 🎯 Comandos Más Utilizados

### 1. Generar todo en una línea (Recomendado para comenzar)
```bash
npm run seed
```
✅ Crea 5 usuarios + 20 denuncias realistas.

---

### 2. Solo generar más denuncias
```bash
npm run create-denuncias
```
✅ Crea 20 denuncias con datos variados.

---

### 3. Generar cantidad personalizada de denuncias
```bash
# 50 denuncias
node scripts/generateDenunciasAdvanced.js --cantidad 50

# 100 denuncias
node scripts/generateDenunciasAdvanced.js --cantidad 100

# 5 denuncias urgentes
node scripts/generateDenunciasAdvanced.js --cantidad 5 --prioridad Urgente
```

---

### 4. Generar denuncias de categoría específica
```bash
# Solo denuncias de agua
node scripts/generateDenunciasAdvanced.js --cantidad 30 --categoria "Agua Potable, Alcantarillado Sanitario, Alcantarillado Pluvial"

# Solo denuncias de desechos
node scripts/generateDenunciasAdvanced.js --cantidad 25 --categoria "Recolección de Desechos y Saneamiento Ambiental"

# Solo denuncias de movilidad
node scripts/generateDenunciasAdvanced.js --cantidad 20 --categoria "Movilidad Urbana"

# Solo denuncias de construcción
node scripts/generateDenunciasAdvanced.js --cantidad 15 --categoria "Obstrucción de vías"
```

---

### 5. Generar denuncias combinando filtros
```bash
# 20 denuncias urgentes en proceso
node scripts/generateDenunciasAdvanced.js --cantidad 20 --prioridad Urgente --estado "En proceso"

# 10 denuncias altas de agua ya atendidas
node scripts/generateDenunciasAdvanced.js --cantidad 10 --categoria "Agua Potable" --prioridad Alta --estado Atendida

# 15 denuncias en revisión que no procedan
node scripts/generateDenunciasAdvanced.js --cantidad 15 --estado "No procede"
```

---

## 📊 Datos Generados por Comando

| Comando | Usuarios | Denuncias | Categorías | Estados | Prioridades |
|---------|----------|-----------|-----------|---------|------------|
| `npm run seed` | 5 | 20 | Todas | Todas | Todas |
| `npm run create-denuncias` | — | 20 | Todas | Todas | Todas |
| `--cantidad 50` | — | 50 | Todas | Todas | Todas |
| `--cantidad 30 --prioridad Alta` | — | 30 | Todas | Todas | Alta |
| `--cantidad 20 --categoria "Agua"` | — | 20 | Agua | Todas | Todas |

---

## 🔐 Credenciales Generadas

Después de `npm run seed`, puedes usar:

```
usuario@test.com       / usuario123
maria.lopez@test.com   / usuario123
carlos.gonzalez@test.com / usuario123
ana.martinez@test.com  / usuario123
roberto.castro@test.com / usuario123

admin@test.com / admin123
```

---

## 🔗 Endpoints para Probar

```bash
# Listar todas las denuncias
curl http://localhost:3085/denuncia

# Obtener una denuncia por ID
curl http://localhost:3085/denuncia/{id}

# Obtener denuncias de un usuario
curl http://localhost:3085/denuncia/user/{userId}

# Contar denuncias por estado
curl http://localhost:3085/denuncia/stats/estado
```

---

## 💡 Ejemplos Prácticos

### Scenario: Testing de Dashboards
```bash
# Generar mucho más volumen de datos
npm run seed
node scripts/generateDenunciasAdvanced.js --cantidad 100
node scripts/generateDenunciasAdvanced.js --cantidad 50 --prioridad Urgente
```

### Scenario: Testing de Filtros por Categoría
```bash
node scripts/generateDenunciasAdvanced.js --cantidad 30 --categoria "Agua Potable, Alcantarillado Sanitario, Alcantarillado Pluvial"
```

### Scenario: Testing de Manejo de Estados
```bash
node scripts/generateDenunciasAdvanced.js --cantidad 15 --estado "En revisión"
node scripts/generateDenunciasAdvanced.js --cantidad 15 --estado "En proceso"
node scripts/generateDenunciasAdvanced.js --cantidad 15 --estado "Atendida"
node scripts/generateDenunciasAdvanced.js --cantidad 15 --estado "No procede"
```

### Scenario: Testing de Prioridades
```bash
node scripts/generateDenunciasAdvanced.js --cantidad 25 --prioridad Baja
node scripts/generateDenunciasAdvanced.js --cantidad 25 --prioridad Media
node scripts/generateDenunciasAdvanced.js --cantidad 25 --prioridad Alta
node scripts/generateDenunciasAdvanced.js --cantidad 25 --prioridad Urgente
```

---

## ⚙️ Requisitos Previos

- ✅ MongoDB corriendo: `brew services start mongodb-community` (macOS)
- ✅ Variables de entorno configuradas en `.env`
- ✅ Dependencias instaladas: `npm install`
- ✅ Estar en la carpeta `denunciaBarrios-back`

---

## 🆘 Si Algo No Funciona

```bash
# Verificar MongoDB está corriendo
brew services list | grep mongodb

# Reiniciar MongoDB
brew services restart mongodb-community

# Ver logs del script
npm run seed 2>&1 | less

# Verificar conexión a base de datos
mongosh # Luego: show dbs
```

---

## 📚 Ver Más Información

- **Documentación completa:** Ver [CREATE_DENUNCIAS_GUIDE.md](./CREATE_DENUNCIAS_GUIDE.md)
- **Todos los scripts:** Ver [README.md](./README.md)
- **Archivos de scripts:**
  - `createTestDenuncias.js` - Script estándar de denuncias
  - `generateDenunciasAdvanced.js` - Script avanzado con opciones
  - `createTestUsers.js` - Creación de usuarios

---

**Pro Tip:** Guarda estos comandos en tu terminal favorita o en un alias para acceso rápido:

```bash
# Agregar a ~/.zshrc o ~/.bashrc
alias seed="npm run seed"
alias denuncias="npm run create-denuncias"
alias denu-advanced="node scripts/generateDenunciasAdvanced.js"
```

Luego simplemente:
```bash
seed
denu-advanced --cantidad 100
```

---

**¡Happy Testing! 🚀**
