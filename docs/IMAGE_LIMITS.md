# Sistema de Límites de Generación de Imágenes

Este documento describe el sistema de límites para la generación de imágenes implementado en la aplicación.

## Descripción General

El sistema de límites controla cuántas imágenes puede generar un usuario basándose en su plan de suscripción. Los límites se reinician automáticamente según el intervalo de la suscripción (mensual o anual).

## Componentes

### 1. Esquema de Base de Datos

#### Modelo `User`
- `imageGenerationCount`: Contador de imágenes generadas en el período actual
- `imageGenerationResetAt`: Fecha de último reinicio del contador

#### Modelo `Subscription`
- `imageGenerationLimit`: Límite de imágenes que se pueden generar por período
- `interval`: Período de reinicio (`MONTHLY` o `YEARLY`)

### 2. Servicios

#### `server/utils/imageLimit.ts`

**`checkImageGenerationLimit(userId: string)`**
- Verifica si un usuario puede generar imágenes
- Reinicia automáticamente el contador si el período ha expirado
- Retorna información sobre el límite, uso actual y mensajes

**`incrementImageGenerationCount(userId: string, count: number)`**
- Incrementa el contador de imágenes generadas
- Se llama automáticamente después de generar imágenes exitosamente

**`getImageGenerationStats(userId: string)`**
- Obtiene estadísticas detalladas de uso de generación de imágenes
- Útil para mostrar en el perfil del usuario

### 3. API Endpoints

#### `GET /api/user/image-stats`
Obtiene las estadísticas de generación de imágenes del usuario autenticado.

**Respuesta:**
```json
{
  "hasSubscription": true,
  "subscriptionName": "Pro",
  "interval": "MONTHLY",
  "limit": 50,
  "used": 12,
  "remaining": 38,
  "resetAt": "2025-01-01T00:00:00.000Z"
}
```

### 4. Integración con Herramientas

La herramienta `toolGenerateImage` en `server/utils/tool.ts` verifica automáticamente los límites antes de generar imágenes y actualiza el contador después de una generación exitosa.

## Configuración de Límites

### Límites Recomendados por Plan

| Plan | Límite Mensual | Límite Anual |
|------|---------------|--------------|
| Free | 0 | 0 |
| Basic | 10 | 120 |
| Pro | 50 | 600 |
| Premium | 100 | 1200 |
| Enterprise | Ilimitado | Ilimitado |

**Nota:** Para límites ilimitados, usa `-1` o un número muy alto (ej: 999999).

### Actualizar Límites de Suscripciones Existentes

Ejecuta el script de migración:

```bash
npx tsx update_image_limits.ts
```

Este script actualizará automáticamente todas las suscripciones existentes con límites apropiados basados en el nombre y precio del plan.

## Flujo de Trabajo

1. **Usuario solicita generar imagen**
   - El sistema verifica si tiene una suscripción activa
   - Verifica si el período actual ha expirado (reinicia si es necesario)
   - Verifica si el usuario ha alcanzado su límite

2. **Generación permitida**
   - Se genera la imagen
   - Se incrementa el contador automáticamente

3. **Generación denegada**
   - Se lanza un error 403 con mensaje descriptivo
   - El usuario ve un mensaje indicando que ha alcanzado su límite

## Mensajes de Error

### Sin suscripción
```
Necesitas una suscripción activa para generar imágenes
```

### Límite alcanzado
```
Has alcanzado el límite de X imágenes para este mes/año
```

### Generación permitida
```
Puedes generar X imagen(es) más este mes/año
```

## Consideraciones de Desarrollo

### Reinicio Automático
El contador se reinicia automáticamente cuando:
- Para suscripciones mensuales: Ha pasado al menos 1 mes desde `imageGenerationResetAt`
- Para suscripciones anuales: Ha pasado al menos 1 año desde `imageGenerationResetAt`

### Transacciones
El sistema no usa transacciones para el incremento del contador. Si necesitas mayor precisión, considera implementar transacciones o usar operaciones atómicas.

### Caché
Los límites se consultan en cada generación. Si tienes alto tráfico, considera implementar caché con Redis.

## Extensiones Futuras

### Posibles Mejoras
1. **Notificaciones**: Alertar al usuario cuando esté cerca de su límite
2. **Compra de paquetes adicionales**: Permitir comprar imágenes extra
3. **Historial**: Registrar cada generación para auditoría
4. **Analytics**: Dashboard de administrador para ver uso global
5. **Rate limiting**: Limitar generaciones por minuto/hora además del límite mensual

## Ejemplos de Uso

### Verificar límites en el frontend

```typescript
const stats = await $fetch('/api/user/image-stats')

if (!stats.hasSubscription) {
  // Mostrar mensaje de suscripción requerida
} else if (stats.remaining === 0) {
  // Mostrar mensaje de límite alcanzado
} else {
  // Permitir generar imagen
  console.log(`Te quedan ${stats.remaining} imágenes`)
}
```

### Crear nueva suscripción con límites

```typescript
await prisma.subscription.create({
  data: {
    name: 'Pro Plan',
    price: 29.99,
    interval: 'MONTHLY',
    imageGenerationLimit: 50,
    // ... otros campos
  }
})
```
