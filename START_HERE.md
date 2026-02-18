# 🚀 Generador de Datos de Prueba - Comienza Aquí

## ⚡ En 30 Segundos

```bash
npm run seed
```

✅ **Listo.** Tu base de datos ahora tiene:
- 5 usuarios de prueba
- 20 denuncias realistas
- Datos variados y distribuidos

---

## 🎯 ¿Qué Necesitas?

### Opción 1: Solo empezar (Recomendado)
```bash
npm run seed
```

### Opción 2: Más datos
```bash
npm run create-denuncias          # +20 más
node scripts/generateDenunciasAdvanced.js --cantidad 100  # +100 exactas
```

### Opción 3: Datos específicos
```bash
# 50 denuncias urgentes
node scripts/generateDenunciasAdvanced.js --cantidad 50 --prioridad Urgente

# 30 solo de agua
node scripts/generateDenunciasAdvanced.js --cantidad 30 --categoria "Agua Potable"

# Ver todas opciones
node scripts/generateDenunciasAdvanced.js --help
```

### Opción 4: Limpiar todo
```bash
node scripts/cleanTestData.js
```

---

## 📋 Credenciales Creadas

```
usuario@test.com       / usuario123
maria.lopez@test.com   / usuario123
carlos@test.com        / usuario123
ana.martinez@test.com  / usuario123
roberto@test.com       / usuario123
```

---

## 📚 Documentación

| Documento | Para | Tiempo |
|-----------|------|--------|
| 📄 [INDICE_MAESTRO.md](./INDICE_MAESTRO.md) | Navegar toda la suite | 2 min |
| 📄 [RESUMEN_ENTREGA.md](./RESUMEN_ENTREGA.md) | Entender qué se hizo | 5 min |
| 📄 [scripts/QUICK_REFERENCE.md](./scripts/QUICK_REFERENCE.md) | Comandos rápidos | 2 min |
| 📄 [MAPA_GENERADORES.md](./MAPA_GENERADORES.md) | Ver flowcharts | 5 min |
| 📄 [scripts/CREATE_DENUNCIAS_GUIDE.md](./scripts/CREATE_DENUNCIAS_GUIDE.md) | Guía completa | 15 min |

> 👉 **Comienza con:** [INDICE_MAESTRO.md](./INDICE_MAESTRO.md) si tienes dudas sobre dónde ir.

---

## ✅ Requisitos

- MongoDB corriendo
- `npm install` ejecutado
- Variables de entorno en `.env`

---

## 🎯 Próximo Paso

```bash
npm run seed   # Ejecuta E-STO
```

Luego accede a:
- http://localhost:3085/denuncia (Ver denuncias)
- Frontend login con las credenciales arriba

---

## 📞 ¿Ayuda?

- **Nuevas en todo:** Lee [RESUMEN_ENTREGA.md](./RESUMEN_ENTREGA.md)
- **Quiero comandos:** Lee [scripts/QUICK_REFERENCE.md](./scripts/QUICK_REFERENCE.md)
- **Qué archivo leer:** Lee [INDICE_MAESTRO.md](./INDICE_MAESTRO.md)
- **Tengo problema:** Lee [scripts/CREATE_DENUNCIAS_GUIDE.md](./scripts/CREATE_DENUNCIAS_GUIDE.md)

---

## 🎉 ¡Listo!

Todo está configurado. Solo ejecuta:

```bash
npm run seed
```

**Y comienza a testear. 🚀**
