# 🧪 Ejemplos de Uso - API de Administración

Esta guía proporciona ejemplos prácticos de cómo usar los nuevos endpoints de administración.

## 📝 Variables de Entorno

```bash
# Base URL
BASE_URL=http://localhost:3085

# Token de administrador (obtenido después del login)
ADMIN_TOKEN=<tu_token_aqui>
```

---

## 1️⃣ GESTIÓN DE PERSONAL MUNICIPAL

### 1.1 Registrar Nuevo Personal

```bash
curl -X POST "${BASE_URL}/admin/personal" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "nombreCompleto": "Pedro Ramírez",
    "cedula": "1122334455",
    "cargo": "Inspector de Obras",
    "departamento": "Obras Públicas y Movilidad",
    "especialidad": "Bacheo y mantenimiento vial",
    "telefono": "0987654321",
    "email": "pedro.ramirez@municipio.gob.ec"
  }'
```

**Respuesta esperada:**
```json
{
  "code": 201,
  "status": "success",
  "message": "Personal registrado exitosamente",
  "data": {
    "_id": "6123456789abcdef12345679",
    "nombreCompleto": "Pedro Ramírez",
    "cedula": "1122334455",
    "cargo": "Inspector de Obras",
    "departamento": "Obras Públicas y Movilidad",
    "estado": "Activo",
    "denunciasAsignadas": [],
    "denunciasResueltas": 0
  }
}
```

### 1.2 Listar Todo el Personal

```bash
curl -X GET "${BASE_URL}/admin/personal" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}"
```

### 1.3 Listar Personal Disponible de un Departamento

```bash
curl -X GET "${BASE_URL}/admin/personal?departamento=Obras Públicas y Movilidad&disponible=true" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}"
```

### 1.4 Obtener Detalles de Personal Específico

```bash
# Reemplazar {PERSONAL_ID} con el ID real
curl -X GET "${BASE_URL}/admin/personal/{PERSONAL_ID}" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}"
```

### 1.5 Actualizar Estado del Personal

```bash
curl -X PUT "${BASE_URL}/admin/personal/{PERSONAL_ID}" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "estado": "En comisión"
  }'
```

### 1.6 Desactivar Personal

```bash
curl -X DELETE "${BASE_URL}/admin/personal/{PERSONAL_ID}" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}"
```

---

## 2️⃣ ASIGNACIÓN DE PERSONAL A DENUNCIAS

### 2.1 Asignar Personal a una Denuncia

```bash
curl -X POST "${BASE_URL}/admin/asignarPersonal" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "denunciaId": "6123456789abcdef12345678",
    "personalId": "6123456789abcdef12345679",
    "observaciones": "Personal especializado asignado para inspección inicial"
  }'
```

**Respuesta esperada:**
```json
{
  "code": 200,
  "status": "success",
  "message": "Personal asignado exitosamente",
  "data": {
    "_id": "6123456789abcdef12345678",
    "tituloDenuncia": "Bache en calle principal",
    "estado": "En proceso",
    "personalAsignado": {
      "_id": "6123456789abcdef12345679",
      "nombreCompleto": "Pedro Ramírez",
      "cargo": "Inspector de Obras",
      "departamento": "Obras Públicas y Movilidad",
      "telefono": "0987654321",
      "email": "pedro.ramirez@municipio.gob.ec"
    },
    "historialEstados": [...]
  }
}
```

---

## 3️⃣ RESPUESTAS PREDETERMINADAS

### 3.1 Ver Todas las Plantillas Disponibles

```bash
curl -X GET "${BASE_URL}/admin/respuestaPredeterminada/plantillas" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}"
```

### 3.2 Ver Plantillas por Categoría

```bash
curl -X GET "${BASE_URL}/admin/respuestaPredeterminada/plantillas?categoria=Movilidad Urbana: Bacheo de Calles, Frecuencias, Obstrucciones de aceras, etc." \
  -H "Authorization: Bearer ${ADMIN_TOKEN}"
```

**Respuesta esperada:**
```json
{
  "code": 200,
  "status": "success",
  "message": "Plantillas obtenidas exitosamente",
  "data": {
    "categoria": "Movilidad Urbana...",
    "plantillas": {
      "tiempo_resolucion": {
        "rapida": {
          "mensaje": "Equipo de obras públicas ha sido notificado...",
          "tiempoEstimado": "2-3 días hábiles"
        },
        "media": {...},
        "larga": {...}
      },
      "no_procede": {
        "via_nacional": {...},
        "falta_presupuesto": {...}
      }
    }
  }
}
```

### 3.3 Asignar Respuesta Rápida (Tiempo de Resolución)

```bash
curl -X POST "${BASE_URL}/admin/respuestaPredeterminada" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "denunciaId": "6123456789abcdef12345678",
    "tipoRespuesta": "tiempo_resolucion",
    "subtipo": "rapida"
  }'
```

### 3.4 Asignar Respuesta de No Procede

```bash
curl -X POST "${BASE_URL}/admin/respuestaPredeterminada" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "denunciaId": "6123456789abcdef12345678",
    "tipoRespuesta": "no_procede",
    "subtipo": "falta_presupuesto"
  }'
```

### 3.5 Asignar Respuesta Personalizada

```bash
curl -X POST "${BASE_URL}/admin/respuestaPredeterminada" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "denunciaId": "6123456789abcdef12345678",
    "tipoRespuesta": "personalizada",
    "mensajePersonalizado": "Hemos recibido su denuncia y está siendo evaluada por nuestro equipo técnico. Debido a la complejidad del problema, necesitamos realizar un estudio más detallado antes de proceder.",
    "tiempoEstimadoPersonalizado": "10-15 días hábiles"
  }'
```

---

## 4️⃣ GESTIÓN DE ESTADOS Y PRIORIDADES

### 4.1 Cambiar Estado de Denuncia con Observaciones

```bash
curl -X POST "${BASE_URL}/admin/estadoDenuncia" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "_id": "6123456789abcdef12345678",
    "estado": "En proceso",
    "observaciones": "Personal asignado, iniciando inspección",
    "prioridad": "Alta"
  }'
```

### 4.2 Marcar Denuncia como Atendida

```bash
curl -X POST "${BASE_URL}/admin/estadoDenuncia" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "_id": "6123456789abcdef12345678",
    "estado": "Atendida",
    "observaciones": "Problema resuelto satisfactoriamente. Se realizó bacheo completo de la zona."
  }'
```

### 4.3 Marcar Denuncia como No Procede

```bash
curl -X POST "${BASE_URL}/admin/estadoDenuncia" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "_id": "6123456789abcdef12345678",
    "estado": "No procede",
    "observaciones": "La vía reportada es de competencia nacional (MTOP)"
  }'
```

---

## 5️⃣ HISTORIAL Y SEGUIMIENTO

### 5.1 Ver Historial Completo de una Denuncia

```bash
curl -X GET "${BASE_URL}/admin/historialDenuncia/{DENUNCIA_ID}" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}"
```

**Respuesta esperada:**
```json
{
  "code": 200,
  "status": "success",
  "message": "Historial obtenido exitosamente",
  "data": {
    "denuncia": {
      "id": "6123456789abcdef12345678",
      "titulo": "Bache en vía principal",
      "descripcion": "Bache grande en calle 10 de Agosto...",
      "categoria": "Movilidad Urbana...",
      "estadoActual": "Atendida",
      "prioridad": "Alta",
      "fechaCreacion": "04/02/2026"
    },
    "denunciante": {
      "nombre": "María González",
      "id": "..."
    },
    "personalAsignado": {
      "nombre": "Pedro Ramírez",
      "cargo": "Inspector de Obras",
      "departamento": "Obras Públicas y Movilidad",
      "contacto": {
        "telefono": "0987654321",
        "email": "pedro.ramirez@municipio.gob.ec"
      }
    },
    "respuesta": {
      "tipo": "tiempo_resolucion",
      "mensaje": "Equipo de obras públicas ha sido notificado...",
      "tiempoEstimado": "2-3 días hábiles",
      "fechaRespuesta": "2026-02-04T10:30:00.000Z"
    },
    "historialEstados": [
      {
        "estado": "En revisión",
        "fecha": "2026-02-04T09:00:00.000Z",
        "admin": {
          "nombre": "Admin Principal",
          "email": "admin@municipio.gob.ec"
        },
        "observaciones": "Estado inicial - migrado automáticamente"
      },
      {
        "estado": "En proceso",
        "fecha": "2026-02-04T10:30:00.000Z",
        "admin": {
          "nombre": "Admin Principal",
          "email": "admin@municipio.gob.ec"
        },
        "observaciones": "Personal asignado: Pedro Ramírez"
      },
      {
        "estado": "Atendida",
        "fecha": "2026-02-06T14:20:00.000Z",
        "admin": {
          "nombre": "Admin Principal",
          "email": "admin@municipio.gob.ec"
        },
        "observaciones": "Problema resuelto satisfactoriamente. Se realizó bacheo completo."
      }
    ],
    "ubicacion": {...},
    "evidencia": "https://cloudinary.com/..."
  }
}
```

---

## 6️⃣ FLUJO COMPLETO DE GESTIÓN

### Ejemplo: Gestionar una denuncia de bacheo desde cero

```bash
# 1. Listar denuncias pendientes
curl -X GET "${BASE_URL}/admin/getAllDenuncias" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}"

# 2. Ver detalles de una denuncia específica
DENUNCIA_ID="6123456789abcdef12345678"
curl -X GET "${BASE_URL}/admin/detallesDenuncia/${DENUNCIA_ID}" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}"

# 3. Buscar personal disponible del departamento apropiado
curl -X GET "${BASE_URL}/admin/personal?departamento=Obras Públicas y Movilidad&disponible=true" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}"

# 4. Asignar personal
PERSONAL_ID="6123456789abcdef12345679"
curl -X POST "${BASE_URL}/admin/asignarPersonal" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "denunciaId": "'${DENUNCIA_ID}'",
    "personalId": "'${PERSONAL_ID}'",
    "observaciones": "Inspector asignado para evaluación técnica"
  }'

# 5. Cambiar estado a "En proceso" y asignar prioridad
curl -X POST "${BASE_URL}/admin/estadoDenuncia" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "_id": "'${DENUNCIA_ID}'",
    "estado": "En proceso",
    "prioridad": "Alta",
    "observaciones": "Personal asignado, iniciando inspección"
  }'

# 6. Ver plantillas de respuesta para la categoría
curl -X GET "${BASE_URL}/admin/respuestaPredeterminada/plantillas?categoria=Movilidad Urbana: Bacheo de Calles, Frecuencias, Obstrucciones de aceras, etc." \
  -H "Authorization: Bearer ${ADMIN_TOKEN}"

# 7. Asignar respuesta predeterminada
curl -X POST "${BASE_URL}/admin/respuestaPredeterminada" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "denunciaId": "'${DENUNCIA_ID}'",
    "tipoRespuesta": "tiempo_resolucion",
    "subtipo": "rapida"
  }'

# 8. Verificar historial completo
curl -X GET "${BASE_URL}/admin/historialDenuncia/${DENUNCIA_ID}" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}"

# 9. Cuando se resuelva, marcar como atendida
curl -X POST "${BASE_URL}/admin/estadoDenuncia" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "_id": "'${DENUNCIA_ID}'",
    "estado": "Atendida",
    "observaciones": "Bacheo completado exitosamente"
  }'
```

---

## 📊 Filtros y Consultas Útiles

### Listar personal por estado
```bash
# Personal activo
curl -X GET "${BASE_URL}/admin/personal?estado=Activo" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}"

# Personal inactivo
curl -X GET "${BASE_URL}/admin/personal?estado=Inactivo" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}"

# Personal en comisión
curl -X GET "${BASE_URL}/admin/personal?estado=En comisión" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}"
```

### Personal con menos carga de trabajo
```bash
curl -X GET "${BASE_URL}/admin/personal?disponible=true" \
  -H "Authorization: Bearer ${ADMIN_TOKEN}"
```

---

## ⚠️ Manejo de Errores Comunes

### Error 400: Parámetros faltantes
```json
{
  "code": 400,
  "status": "error",
  "message": "Faltan parámetros requeridos: denunciaId y personalId",
  "data": {}
}
```

### Error 404: Recurso no encontrado
```json
{
  "code": 404,
  "status": "error",
  "message": "Personal municipal no encontrado",
  "data": {}
}
```

### Error 401: No autorizado
```json
{
  "code": 401,
  "status": "error",
  "message": "Acceso no autorizado",
  "data": {}
}
```

---

## 🔐 Obtener Token de Administrador

```bash
# Login de administrador
curl -X POST "${BASE_URL}/admin/loginAdmin" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@test.com",
    "password": "admin123"
  }'
```

**Respuesta:**
```json
{
  "code": 200,
  "status": "success",
  "message": "Login exitoso",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "admin": {
      "_id": "...",
      "nombreCompleto": "Admin Principal",
      "email": "admin@test.com"
    }
  }
}
```

Usar el token retornado en todos los endpoints protegidos.

---

## 📝 Notas Adicionales

1. **IDs de Ejemplo**: Todos los IDs mostrados son ejemplos. Usa los IDs reales de tu base de datos.

2. **Codificación de URLs**: Para categorías con espacios, asegúrate de codificar correctamente:
   ```
   "Obras Públicas y Movilidad" → "Obras%20P%C3%BAblicas%20y%20Movilidad"
   ```

3. **Autorización**: Todos los endpoints requieren el header `Authorization: Bearer <token>`.

4. **Content-Type**: Siempre incluir `Content-Type: application/json` en peticiones POST/PUT.

---

Para más información, consulta [ADMIN_FEATURES.md](../ADMIN_FEATURES.md)
