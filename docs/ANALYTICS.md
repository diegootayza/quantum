# 📊 Sistema de Analytics

## Descripción General

Sistema completo de analytics para SaaS que rastrea eventos, calcula métricas de negocio y proporciona insights sobre el crecimiento y uso del producto.

## 🎯 Características

### 1. **Event Tracking**
- Rastreo automático de eventos clave
- Almacenamiento en base de datos
- Metadata personalizada por evento
- Consultas y filtros avanzados

### 2. **Business Metrics**
- **MRR** (Monthly Recurring Revenue)
- **ARR** (Annual Recurring Revenue)
- **Churn Rate** (Tasa de cancelación)
- **Conversion Rate** (Trial a Pago)
- **LTV** (Lifetime Value)

### 3. **Growth Metrics**
- Total de usuarios
- Usuarios activos
- Nuevos usuarios por período
- Tasa de crecimiento

### 4. **Subscription Metrics**
- Suscripciones activas
- Nuevas suscripciones
- Cancelaciones
- ARPU (Average Revenue Per User)
- Distribución por plan

### 5. **Product Metrics**
- Conversaciones creadas
- Mensajes enviados
- Imágenes generadas
- Archivos subidos

## 📦 Estructura de Archivos

```
server/
├── utils/
│   └── analytics/
│       ├── events.ts           # Sistema de tracking de eventos
│       └── metrics.ts          # Cálculo de métricas de negocio
└── api/
    └── dashboard/
        └── analytics/
            ├── business-metrics.get.ts    # Endpoint de métricas de negocio
            ├── growth-metrics.get.ts      # Endpoint de métricas de crecimiento
            └── events.get.ts              # Endpoint de eventos

app/
└── pages/
    └── dashboard/
        └── analytics.vue       # Dashboard de visualización

prisma/
└── schema.prisma              # Modelo AnalyticsEvent
```

## 🔌 API Endpoints

### GET `/api/dashboard/analytics/business-metrics`
Obtiene métricas de negocio clave.

**Requiere**: Rol ADMIN

**Respuesta**:
```json
{
  "mrr": 1250.50,
  "arr": 15006.00,
  "churnRate": 2.5,
  "conversionRate": 15.3,
  "ltv": 850.00
}
```

### GET `/api/dashboard/analytics/growth-metrics?days=30`
Obtiene métricas de crecimiento y producto.

**Requiere**: Rol ADMIN

**Query Params**:
- `days` (opcional): Número de días (default: 30)

**Respuesta**:
```json
{
  "period": "30 days",
  "growthMetrics": {
    "totalUsers": 1500,
    "activeUsers": 850,
    "newUsers": 120,
    "newUsersGrowth": 15.5
  },
  "subscriptionMetrics": {
    "activeSubscriptions": 450,
    "newSubscriptions": 45,
    "cancelledSubscriptions": 12,
    "averageRevenuePerUser": 29.99,
    "subscriptionsByPlan": {
      "Basic": 200,
      "Pro": 250
    }
  },
  "productMetrics": {
    "conversationsThisPeriod": 3500,
    "messagesThisPeriod": 25000,
    "imagesThisPeriod": 1200,
    "totalConversations": 15000,
    "totalMessages": 120000,
    "totalImagesGenerated": 5000,
    "totalFilesUploaded": 8000
  }
}
```

### GET `/api/dashboard/analytics/events?days=30&eventType=image_generated`
Obtiene eventos rastreados.

**Requiere**: Rol ADMIN

**Query Params**:
- `days` (opcional): Número de días (default: 30)
- `eventType` (opcional): Filtrar por tipo de evento

**Respuesta** (sin eventType):
```json
{
  "period": "30 days",
  "eventCounts": [
    { "type": "user_signed_up", "count": 120 },
    { "type": "image_generated", "count": 1200 },
    { "type": "conversation_created", "count": 3500 }
  ]
}
```

**Respuesta** (con eventType):
```json
{
  "total": 1200,
  "events": [
    {
      "id": "...",
      "eventType": "image_generated",
      "userId": "...",
      "timestamp": "2025-12-05T00:00:00.000Z",
      "metadata": {
        "count": 1,
        "conversationId": "...",
        "prompt": "..."
      }
    }
  ],
  "distribution": {
    "2025-12-01": 45,
    "2025-12-02": 52,
    "2025-12-03": 38
  }
}
```

## 📊 Eventos Rastreados

### Tipos de Eventos

| Evento | Descripción | Metadata |
|--------|-------------|----------|
| `user_signed_up` | Usuario se registra | - |
| `user_signed_in` | Usuario inicia sesión | - |
| `subscription_created` | Nueva suscripción | `{ plan, price }` |
| `subscription_upgraded` | Upgrade de plan | `{ fromPlan, toPlan }` |
| `subscription_downgraded` | Downgrade de plan | `{ fromPlan, toPlan }` |
| `subscription_cancelled` | Cancelación | `{ plan, reason }` |
| `image_generated` | Imagen generada | `{ count, conversationId, prompt }` |
| `image_limit_reached` | Límite alcanzado | `{ limit, used }` |
| `image_limit_warning` | Advertencia de límite | `{ percentage, remaining }` |
| `conversation_created` | Nueva conversación | `{ conversationId, hasFiles }` |
| `message_sent` | Mensaje enviado | `{ conversationId, hasAttachments }` |
| `file_uploaded` | Archivo subido | `{ count, totalSize }` |
| `payment_succeeded` | Pago exitoso | `{ amount, plan }` |
| `payment_failed` | Pago fallido | `{ amount, reason }` |

## 💻 Uso del Sistema

### Rastrear un Evento

```typescript
import { trackEvent } from '~/server/utils/analytics/events'

// Rastrear evento simple
await trackEvent({
  eventType: 'user_signed_up',
  userId: user.id
})

// Rastrear evento con metadata
await trackEvent({
  eventType: 'image_generated',
  userId: user.id,
  metadata: {
    count: 1,
    conversationId: 'abc123',
    prompt: 'A beautiful sunset'
  }
})
```

### Rastrear Múltiples Eventos

```typescript
import { trackEventsBatch } from '~/server/utils/analytics/events'

await trackEventsBatch([
  {
    eventType: 'conversation_created',
    userId: user.id,
    metadata: { conversationId: 'abc123' }
  },
  {
    eventType: 'message_sent',
    userId: user.id,
    metadata: { conversationId: 'abc123' }
  }
])
```

### Consultar Eventos

```typescript
import { getEventsByType, countEventsByType } from '~/server/utils/analytics/events'

// Obtener eventos de un tipo
const startDate = new Date('2025-12-01')
const endDate = new Date('2025-12-31')
const events = await getEventsByType('image_generated', startDate, endDate)

// Contar eventos
const count = await countEventsByType('user_signed_up', startDate, endDate)
```

### Calcular Métricas

```typescript
import { 
  calculateMRR, 
  calculateARR, 
  calculateChurnRate,
  getBusinessMetrics 
} from '~/server/utils/analytics/metrics'

// Métricas individuales
const mrr = await calculateMRR()
const arr = await calculateARR()
const churnRate = await calculateChurnRate(30) // últimos 30 días

// Todas las métricas
const metrics = await getBusinessMetrics()
console.log(metrics.mrr, metrics.arr, metrics.churnRate, metrics.ltv)
```

## 🎨 Dashboard de Analytics

### Acceso
**URL**: `/dashboard/analytics`

**Requisitos**: Usuario con rol ADMIN

### Secciones

1. **Métricas de Negocio**
   - MRR, ARR, Churn Rate, Conversión, LTV

2. **Crecimiento**
   - Total usuarios, Activos, Nuevos, Crecimiento %

3. **Suscripciones**
   - Activas, Nuevas, Cancelaciones, ARPU

4. **Uso del Producto**
   - Conversaciones, Mensajes, Imágenes

5. **Eventos**
   - Resumen de todos los eventos rastreados

### Filtros
- 7 días
- 30 días (default)
- 90 días

## 🔧 Configuración

### Modelo de Base de Datos

El modelo `AnalyticsEvent` se crea automáticamente con Prisma:

```prisma
model AnalyticsEvent {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  eventType String
  metadata  Json     @default("{}")
  timestamp DateTime @default(now())
  user      User?    @relation(fields: [userId], references: [id])
  userId    String?  @db.ObjectId

  @@index([eventType])
  @@index([userId])
  @@index([timestamp])
}
```

### Índices

Los índices optimizan las consultas:
- `eventType`: Para filtrar por tipo de evento
- `userId`: Para consultas por usuario
- `timestamp`: Para rangos de fechas

## 📈 Cálculo de Métricas

### MRR (Monthly Recurring Revenue)

```typescript
MRR = Σ (precio_suscripción_mensual * usuarios)

// Para suscripciones anuales:
MRR_anual = (precio_anual / 12) * usuarios
```

### ARR (Annual Recurring Revenue)

```typescript
ARR = MRR * 12
```

### Churn Rate

```typescript
Churn Rate = (Cancelaciones / Usuarios_al_inicio) * 100
```

### Conversion Rate

```typescript
Conversion Rate = (Suscripciones_creadas / Registros) * 100
```

### LTV (Lifetime Value)

```typescript
LTV = ARPU / (Churn_Rate / 100)

donde ARPU = MRR / Usuarios_activos
```

## 🚀 Mejoras Futuras

1. **Gráficos Visuales**
   - Integrar Chart.js o Recharts
   - Gráficos de líneas para tendencias
   - Gráficos de barras para comparaciones

2. **Exportación de Datos**
   - CSV/Excel de métricas
   - PDF de reportes
   - API para integración externa

3. **Alertas Automáticas**
   - Notificar cuando churn > umbral
   - Alertar cuando MRR cae
   - Avisar de anomalías

4. **Cohorte Analysis**
   - Retención por cohorte
   - Comportamiento por segmento
   - Análisis de activación

5. **Funnel Analysis**
   - Embudo de conversión
   - Puntos de abandono
   - Optimización de flujos

6. **A/B Testing**
   - Framework para experimentos
   - Análisis estadístico
   - Resultados automáticos

## 📝 Notas Importantes

- Los eventos se rastrean de forma asíncrona para no bloquear el flujo principal
- Los errores en tracking no interrumpen la aplicación
- Las métricas se calculan en tiempo real (considerar caché para producción)
- Los índices de base de datos son críticos para el rendimiento

## 🐛 Troubleshooting

### Los eventos no se rastrean
- Verificar que Prisma esté sincronizado (`npx prisma generate`)
- Revisar logs del servidor
- Confirmar que el userId sea válido

### Métricas incorrectas
- Verificar datos de suscripciones
- Revisar eventos rastreados
- Confirmar cálculos de fechas

### Dashboard no carga
- Verificar rol ADMIN del usuario
- Revisar endpoints API
- Verificar conexión a base de datos

---

**Sistema implementado**: ✅ Completo y funcional
**Última actualización**: 2025-12-05
