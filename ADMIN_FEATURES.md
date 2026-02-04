# Nuevas Funcionalidades del Administrador - Sistema de Denuncias

## Resumen de Implementación

Se han agregado funcionalidades completas para la gestión administrativa de denuncias ciudadanas, incluyendo:

1. **Gestión de Personal Municipal**
2. **Asignación de Personal a Denuncias**
3. **Respuestas Predeterminadas Automáticas**
4. **Historial Completo de Denuncias**
5. **Sistema de Priorización**

---

## 📋 Cambios en el Modelo de Denuncia

### Nuevos Campos Agregados:

```javascript
{
  // Campos existentes...
  
  // Nuevo estado
  estado: {
    enum: ['En revisión', 'En proceso', 'Atendida', 'No procede']
  },
  
  // Asignación de personal
  personalAsignado: ObjectId, // Referencia a PersonalMunicipal
  
  // Sistema de respuestas predeterminadas
  respuestaPredeterminada: {
    tipo: String, // 'tiempo_resolucion', 'no_procede', 'personalizada'
    mensaje: String,
    tiempoEstimado: String, // ej: "2-3 días", "1 semana"
    fechaRespuesta: Date
  },
  
  // Historial de cambios
  historialEstados: [{
    estado: String,
    fecha: Date,
    adminResponsable: ObjectId, // Referencia a Admin
    observaciones: String
  }],
  
  // Priorización
  prioridad: {
    enum: ['Baja', 'Media', 'Alta', 'Urgente'],
    default: 'Media'
  }
}
```

---

## 👥 Nuevo Modelo: Personal Municipal

### Estructura del Modelo:

```javascript
{
  nombreCompleto: String,
  cedula: String (único),
  cargo: String,
  departamento: String, // Categorizado por áreas de servicio
  especialidad: String,
  telefono: String,
  email: String,
  estado: String, // 'Activo', 'Inactivo', 'En comisión', 'De vacaciones'
  denunciasAsignadas: [ObjectId],
  denunciasResueltas: Number,
  calificacionPromedio: Number (0-5),
  fechaIngreso: Date
}
```

### Departamentos Disponibles:
- Agua Potable y Alcantarillado
- Gestión Ambiental
- Obras Públicas y Movilidad
- Control Urbano y Construcciones

---

## 🔧 Nuevos Endpoints Implementados

### 1. Gestión de Personal Municipal

#### **POST** `/admin/personal`
Registrar nuevo personal municipal

**Body:**
```json
{
  "nombreCompleto": "Juan Pérez",
  "cedula": "1234567890",
  "cargo": "Inspector de Obras",
  "departamento": "Obras Públicas y Movilidad",
  "especialidad": "Infraestructura vial",
  "telefono": "0987654321",
  "email": "juan.perez@municipio.gob.ec"
}
```

#### **GET** `/admin/personal`
Obtener lista de personal con filtros opcionales

**Query Parameters:**
- `departamento`: Filtrar por departamento
- `estado`: Filtrar por estado (Activo, Inactivo, etc.)
- `disponible`: true/false - Solo personal activo con pocas asignaciones

#### **GET** `/admin/personal/:id`
Obtener detalles de un personal específico

#### **PUT** `/admin/personal/:id`
Actualizar información de personal

**Body:**
```json
{
  "cargo": "Inspector Senior",
  "telefono": "0987654322",
  "estado": "Activo"
}
```

#### **DELETE** `/admin/personal/:id`
Desactivar personal (soft delete)

---

### 2. Asignación de Personal a Denuncias

#### **POST** `/admin/asignarPersonal`
Asignar personal municipal a una denuncia

**Body:**
```json
{
  "denunciaId": "6123456789abcdef12345678",
  "personalId": "6123456789abcdef12345679",
  "observaciones": "Personal asignado para inspección inicial"
}
```

**Funcionalidad:**
- Verifica que el personal esté activo
- Actualiza la denuncia con el personal asignado
- Agrega el registro al historial de estados
- Actualiza el array de denuncias del personal

---

### 3. Respuestas Predeterminadas

#### **POST** `/admin/respuestaPredeterminada`
Asignar respuesta predeterminada a una denuncia

**Body (Respuesta Predefinida):**
```json
{
  "denunciaId": "6123456789abcdef12345678",
  "tipoRespuesta": "tiempo_resolucion",
  "subtipo": "rapida"
}
```

**Body (Respuesta Personalizada):**
```json
{
  "denunciaId": "6123456789abcdef12345678",
  "tipoRespuesta": "personalizada",
  "mensajePersonalizado": "Su caso requiere análisis especial...",
  "tiempoEstimadoPersonalizado": "5-7 días hábiles"
}
```

#### **GET** `/admin/respuestaPredeterminada/plantillas`
Obtener plantillas de respuestas predeterminadas

**Query Parameters:**
- `categoria`: Filtrar plantillas por categoría de denuncia

**Plantillas Disponibles:**

##### Para cada categoría:
- **tiempo_resolucion:**
  - `rapida`: 12-48 horas
  - `media`: 3-7 días hábiles
  - `larga`: 15-30 días hábiles

- **no_procede:**
  - `fuera_jurisdiccion`: Problema fuera de competencia municipal
  - `falta_recursos`: Recursos insuficientes, planificación futura
  - `no_evidencia`: Falta de evidencia o detalles
  - `responsabilidad_privada`: Propiedad privada
  - `falta_acceso`: Restricciones de acceso
  - `via_nacional`: Competencia del MTOP
  - `falta_presupuesto`: Excede presupuesto actual
  - `permiso_vigente`: Construcción con permisos vigentes
  - `proceso_legal`: En proceso judicial

---

### 4. Historial de Denuncias

#### **GET** `/admin/historialDenuncia/:id`
Obtener historial completo de una denuncia

**Respuesta:**
```json
{
  "code": 200,
  "status": "success",
  "message": "Historial obtenido exitosamente",
  "data": {
    "denuncia": {
      "id": "...",
      "titulo": "...",
      "estadoActual": "En proceso",
      "prioridad": "Alta"
    },
    "denunciante": {
      "nombre": "María González",
      "id": "..."
    },
    "personalAsignado": {
      "nombre": "Juan Pérez",
      "cargo": "Inspector",
      "departamento": "Obras Públicas",
      "contacto": {
        "telefono": "0987654321",
        "email": "juan@municipio.gob.ec"
      }
    },
    "respuesta": {
      "tipo": "tiempo_resolucion",
      "mensaje": "Su denuncia será atendida en 2-3 días",
      "tiempoEstimado": "2-3 días hábiles"
    },
    "historialEstados": [
      {
        "estado": "En revisión",
        "fecha": "2026-02-04T09:00:00.000Z",
        "admin": {
          "nombre": "Admin Principal",
          "email": "admin@municipio.gob.ec"
        },
        "observaciones": "Denuncia recibida"
      },
      {
        "estado": "En proceso",
        "fecha": "2026-02-04T10:30:00.000Z",
        "admin": {...},
        "observaciones": "Personal asignado"
      }
    ]
  }
}
```

---

### 5. Actualización de Estado (Mejorado)

#### **POST** `/admin/estadoDenuncia`
Cambiar estado de una denuncia (ahora con historial)

**Body (Actualizado):**
```json
{
  "_id": "6123456789abcdef12345678",
  "estado": "En proceso",
  "observaciones": "Se asignó inspector para evaluación",
  "prioridad": "Alta"
}
```

**Nuevas Funcionalidades:**
- Guarda cada cambio en el historial
- Registra el admin responsable automáticamente
- Actualiza contador de denuncias resueltas del personal cuando estado = "Atendida"
- Permite cambiar la prioridad simultáneamente

---

## 🔐 Autenticación

Todos los endpoints requieren autenticación con token JWT de administrador:

```
Headers:
Authorization: Bearer <token_admin>
```

O usando el header personalizado:
```
Headers:
auth-admin: <token_admin>
```

---

## 📊 Flujo de Trabajo Recomendado

### Proceso de Gestión de Denuncias:

1. **Recepción (Automático)**
   - Usuario crea denuncia
   - Estado inicial: "En revisión"
   - Prioridad: "Media"

2. **Revisión por Administrador**
   - GET `/admin/getAllDenuncias` - Ver todas las denuncias
   - GET `/admin/detallesDenuncia/:id` - Revisar detalles
   - POST `/admin/estadoDenuncia` - Cambiar prioridad si es necesario

3. **Asignación de Personal**
   - GET `/admin/personal?disponible=true&departamento=<departamento>` - Buscar personal disponible
   - POST `/admin/asignarPersonal` - Asignar personal a la denuncia
   - Estado sugerido: "En proceso"

4. **Respuesta al Ciudadano**
   - GET `/admin/respuestaPredeterminada/plantillas?categoria=<categoria>` - Ver plantillas
   - POST `/admin/respuestaPredeterminada` - Asignar respuesta con tiempo estimado

5. **Seguimiento**
   - GET `/admin/historialDenuncia/:id` - Ver todo el historial
   - POST `/admin/estadoDenuncia` - Actualizar estado según progreso

6. **Cierre**
   - POST `/admin/estadoDenuncia` con estado "Atendida"
   - O estado "No procede" si corresponde

---

## 📁 Archivos Modificados y Creados

### Modelos:
- ✏️ `src/Models/denuncia.js` - Extendido con nuevos campos
- ✨ `src/Models/personalMunicipal.js` - Nuevo modelo

### Rutas:
- ✏️ `src/Routes/adminRoutes.js` - Agregadas nuevas rutas
- ✏️ `src/Routes/adminRoutes/estadoDenuncia.js` - Mejorado con historial
- ✨ `src/Routes/adminRoutes/asignarPersonal.js` - Nueva funcionalidad
- ✨ `src/Routes/adminRoutes/respuestaPredeterminada.js` - Nueva funcionalidad
- ✨ `src/Routes/adminRoutes/gestionPersonal.js` - CRUD completo de personal
- ✨ `src/Routes/adminRoutes/historialDenuncia.js` - Endpoint de historial

### Documentación:
- ✏️ `openapi.json` - Documentación completa de nuevos endpoints y schemas

---

## 🧪 Ejemplos de Uso

### Ejemplo 1: Registrar Personal y Asignar a Denuncia

```bash
# 1. Registrar personal
curl -X POST http://localhost:3085/admin/personal \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "nombreCompleto": "Carlos Méndez",
    "cedula": "0987654321",
    "cargo": "Técnico de Saneamiento",
    "departamento": "Gestión Ambiental",
    "especialidad": "Recolección de desechos",
    "telefono": "0991234567",
    "email": "carlos.mendez@municipio.gob.ec"
  }'

# 2. Asignar a denuncia
curl -X POST http://localhost:3085/admin/asignarPersonal \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "denunciaId": "6123456789abcdef12345678",
    "personalId": "<id_del_personal_creado>",
    "observaciones": "Personal especializado en recolección asignado"
  }'
```

### Ejemplo 2: Asignar Respuesta Predeterminada

```bash
# Obtener plantillas
curl -X GET "http://localhost:3085/admin/respuestaPredeterminada/plantillas?categoria=Recolección de Desechos y Saneamiento Ambiental" \
  -H "Authorization: Bearer <token>"

# Asignar respuesta
curl -X POST http://localhost:3085/admin/respuestaPredeterminada \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "denunciaId": "6123456789abcdef12345678",
    "tipoRespuesta": "tiempo_resolucion",
    "subtipo": "rapida"
  }'
```

### Ejemplo 3: Consultar Historial Completo

```bash
curl -X GET http://localhost:3085/admin/historialDenuncia/6123456789abcdef12345678 \
  -H "Authorization: Bearer <token>"
```

---

## ⚠️ Notas Importantes

1. **Migración de Datos**: Las denuncias existentes no tienen los nuevos campos. Se recomienda ejecutar un script de migración o estos campos aparecerán como `null`.

2. **Estados Válidos**: El estado "No procede" es nuevo. Actualizar la lógica del frontend si es necesario.

3. **Validaciones**: 
   - Solo personal "Activo" puede ser asignado
   - El historial se guarda automáticamente en cada cambio
   - Cédula del personal debe ser única

4. **Performance**: 
   - Los endpoints populan referencias automáticamente
   - Para grandes volúmenes, considerar paginación

5. **Extensibilidad**:
   - Las plantillas de respuestas se pueden extender fácilmente
   - El sistema de prioridades puede integrarse con notificaciones

---

## 🚀 Próximas Mejoras Sugeridas

1. **Notificaciones por Email**: Notificar al ciudadano cuando:
   - Se asigna personal
   - Se asigna respuesta predeterminada
   - Cambia el estado de la denuncia

2. **Dashboard de Personal**: 
   - Métricas de desempeño
   - Carga de trabajo actual
   - Tiempos promedio de resolución

3. **Sistema de Calificaciones**:
   - Permitir al ciudadano calificar la atención
   - Actualizar `calificacionPromedio` del personal

4. **Reportes y Estadísticas**:
   - Denuncias por departamento
   - Tiempos promedio de atención
   - Personal más eficiente

5. **Geolocalización Inteligente**:
   - Asignar automáticamente personal más cercano
   - Mapas de calor de denuncias

---

## 📞 Soporte

Para dudas o problemas con la implementación, contactar al equipo de desarrollo.

**Fecha de Implementación**: 4 de febrero de 2026
**Versión**: 2.0.0
