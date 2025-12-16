# Dashboard de Administración - Límites de Imágenes

## 📊 Descripción General

El dashboard de administración proporciona una interfaz completa para gestionar y monitorear los límites de generación de imágenes en toda la plataforma.

## 🎯 Características Principales

### 1. **Estadísticas Globales**
Vista general del uso de imágenes en toda la plataforma:
- Total de imágenes generadas (histórico)
- Imágenes generadas este mes
- Usuarios con límites activos
- Usuarios cerca del límite (>80%)
- Usuarios que alcanzaron el límite (100%)

### 2. **Gestión de Límites por Suscripción**
Administra los límites de cada plan de suscripción:
- Ver límite actual por suscripción
- Editar límites en tiempo real
- Ver uso total y promedio por usuario
- Número de usuarios por plan

### 3. **Top Usuarios**
Monitorea los usuarios con mayor uso:
- Top 10 usuarios por imágenes generadas
- Barra de progreso visual del uso
- Información de suscripción
- Opción para resetear contador manualmente

### 4. **Sistema de Notificaciones**
Alertas automáticas por email:
- **Advertencia (80%)**: Cuando el usuario alcanza el 80% de su límite
- **Límite Alcanzado (100%)**: Cuando se alcanza el límite completo
- Plantillas HTML profesionales
- Integración con n8n webhook

## 🔌 Endpoints API

### GET `/api/dashboard/image-stats`
Obtiene estadísticas globales de generación de imágenes.

**Requiere**: Rol ADMIN

**Respuesta**:
```json
{
  "overview": {
    "totalImagesGenerated": 1250,
    "imagesThisMonth": 340,
    "usersWithLimits": 45,
    "nearLimit": 8,
    "atLimit": 3
  },
  "subscriptionStats": [
    {
      "name": "Pro Plan",
      "limit": 50,
      "userCount": 20,
      "totalUsage": 650,
      "avgUsage": 32.5
    }
  ],
  "topUsers": [
    {
      "id": "...",
      "name": "Juan Pérez",
      "email": "juan@example.com",
      "subscription": "Pro Plan",
      "used": 48,
      "limit": 50,
      "resetAt": "2025-01-01T00:00:00.000Z"
    }
  ]
}
```

### PATCH `/api/dashboard/subscription/[id]/image-limit`
Actualiza el límite de generación de imágenes de una suscripción.

**Requiere**: Rol ADMIN

**Body**:
```json
{
  "imageGenerationLimit": 100
}
```

### POST `/api/dashboard/user/[id]/reset-image-count`
Resetea manualmente el contador de un usuario.

**Requiere**: Rol ADMIN

**Respuesta**:
```json
{
  "message": "Contador reseteado exitosamente",
  "user": {
    "id": "...",
    "name": "Juan",
    "surname": "Pérez",
    "email": "juan@example.com",
    "imageGenerationCount": 0,
    "imageGenerationResetAt": "2025-12-05T04:00:00.000Z"
  }
}
```

## 🎨 Interfaz de Usuario

### Acceso al Dashboard
**URL**: `/dashboard/image-limits`

**Requisitos**: Usuario con rol ADMIN

### Componentes Visuales

#### 1. **Tarjetas de Resumen**
5 tarjetas con métricas clave:
- Total Generadas
- Este Mes
- Usuarios con Límites
- Cerca del Límite (naranja)
- En el Límite (rojo)

#### 2. **Panel de Suscripciones**
Para cada suscripción muestra:
- Nombre del plan
- Número de usuarios
- Límite actual
- Uso total
- Promedio por usuario
- Botón para editar límite

#### 3. **Lista de Top Usuarios**
Ranking de usuarios con:
- Posición (1-10)
- Nombre y email
- Uso actual / Límite
- Nombre de suscripción
- Barra de progreso con colores:
  - Verde: <80%
  - Naranja: 80-99%
  - Rojo: 100%
- Botón para resetear contador

#### 4. **Modal de Edición**
Permite editar el límite de una suscripción:
- Input numérico
- Validación (mínimo 0)
- Sugerencia para límite ilimitado (-1)

## 📧 Sistema de Notificaciones

### Configuración

Las notificaciones se envían automáticamente cuando:
1. Usuario alcanza 80-90% del límite (solo una vez)
2. Usuario alcanza 100% del límite

### Plantillas de Email

#### Advertencia (80%)
- Asunto: "⚠️ Advertencia de Límite de Imágenes"
- Color: Naranja
- Contenido:
  - Mensaje de advertencia
  - Estadísticas de uso
  - Enlace a planes

#### Límite Alcanzado (100%)
- Asunto: "🚫 Límite de Imágenes Alcanzado"
- Color: Rojo
- Contenido:
  - Mensaje de bloqueo
  - Fecha de reinicio
  - Enlace para actualizar plan

### Integración con n8n

Las notificaciones se envían a través de webhook:

```typescript
await $fetch(useRuntimeConfig().n8nWebhook, {
  method: 'POST',
  body: {
    event: 'image_limit_warning', // o 'image_limit_reached'
    email: 'user@example.com',
    name: 'Usuario',
    used: 40,
    limit: 50,
    remaining: 10,
    resetAt: '2025-01-01',
    type: 'warning' // o 'limit_reached'
  }
})
```

## 🔧 Funciones Administrativas

### Editar Límite de Suscripción

```typescript
// En el dashboard
async function updateLimit(subscriptionId: string, newLimit: number) {
  await $fetch(`/api/dashboard/subscription/${subscriptionId}/image-limit`, {
    method: 'PATCH',
    body: { imageGenerationLimit: newLimit }
  })
}
```

### Resetear Contador de Usuario

```typescript
// En el dashboard
async function resetUserCount(userId: string) {
  await $fetch(`/api/dashboard/user/${userId}/reset-image-count`, {
    method: 'POST'
  })
}
```

## 📈 Métricas y Analytics

### Cálculos Importantes

**Porcentaje de Uso**:
```typescript
const percentage = (used / limit) * 100
```

**Promedio por Usuario**:
```typescript
const avgUsage = totalUsage / userCount
```

**Usuarios Cerca del Límite**:
```typescript
const nearLimit = users.filter(u => 
  (u.imageGenerationCount / u.subscription.imageGenerationLimit) >= 0.8
).length
```

## 🎯 Casos de Uso

### 1. Monitorear Uso Global
- Acceder al dashboard
- Revisar tarjetas de resumen
- Identificar tendencias

### 2. Ajustar Límites
- Ir a "Límites por Suscripción"
- Click en "Editar Límite"
- Ingresar nuevo valor
- Guardar

### 3. Gestionar Usuario Específico
- Revisar "Top Usuarios"
- Identificar usuario con problema
- Click en botón de reset
- Confirmar acción

### 4. Responder a Alertas
- Revisar usuarios en el límite
- Contactar usuarios proactivamente
- Ofrecer upgrade de plan

## 🔐 Seguridad

- Todos los endpoints requieren autenticación
- Solo usuarios con rol `ADMIN` pueden acceder
- Validación de datos en servidor
- Logs de acciones administrativas

## 🚀 Mejoras Futuras

1. **Gráficos Históricos**: Tendencias de uso a lo largo del tiempo
2. **Exportar Reportes**: CSV/PDF de estadísticas
3. **Alertas Personalizadas**: Configurar umbrales por administrador
4. **Bulk Operations**: Resetear múltiples usuarios a la vez
5. **Audit Log**: Registro de todas las acciones administrativas
6. **Predicciones**: ML para predecir cuándo usuarios alcanzarán límites

## 📝 Notas Importantes

- Los límites se verifican en cada generación
- El reinicio es automático según el intervalo de suscripción
- Las notificaciones se envían solo una vez por umbral
- El dashboard se actualiza en tiempo real
- Todos los cambios son inmediatos

## 🐛 Troubleshooting

### Dashboard no carga
- Verificar que el usuario tenga rol ADMIN
- Revisar logs del servidor
- Verificar conexión a base de datos

### Notificaciones no se envían
- Verificar configuración de n8nWebhook
- Revisar logs de errores
- Confirmar que el webhook esté activo

### Límites no se actualizan
- Regenerar cliente de Prisma
- Verificar que la base de datos esté sincronizada
- Revisar permisos del usuario
