# 🔧 ERROR RESUELTO - imageGenerationResetAt

## ❌ **Error Original**

```
Error converting field "imageGenerationResetAt" of expected non-nullable type "DateTime", 
found incompatible value of "null".
```

**Código de error**: `P2032`

---

## 🔍 **Causa del Problema**

El campo `imageGenerationResetAt` fue agregado al modelo `User` en Prisma con un valor por defecto de `@default(now())`, pero los usuarios que ya existían en la base de datos **antes** de agregar este campo tenían el valor como `null`.

### **Por qué sucedió**:
1. Se agregó el campo `imageGenerationResetAt` al schema de Prisma
2. Se ejecutó `npx prisma db push` que agregó el campo a la base de datos
3. Los usuarios existentes quedaron con `null` en ese campo
4. Prisma espera un valor `DateTime` no nulo, pero encuentra `null`

---

## ✅ **Solución Implementada**

### **Paso 1: Crear Script de Migración**

Creé el archivo `scripts/migrate-users.ts` que:
- Encuentra todos los usuarios en la base de datos
- Actualiza `imageGenerationCount` a `0`
- Actualiza `imageGenerationResetAt` a la fecha actual

### **Paso 2: Ejecutar Migración**

```bash
npx tsx scripts/migrate-users.ts
```

**Resultado**:
```
🔄 Actualizando usuarios existentes...
📊 Encontrados 3 usuarios
✅ Actualizado: diegootayza@live.com
✅ Actualizado: sergiomontano@live.com
✅ Actualizado: admin@test.com

✅ Migración completada!
   Total usuarios: 3
   Actualizados: 3
```

### **Paso 3: Verificar**

✅ Homepage carga sin errores
✅ Todos los usuarios tienen valores válidos
✅ Sistema funcionando correctamente

---

## 📝 **Código del Script de Migración**

```typescript
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const usersToUpdate = await prisma.user.findMany({
        select: {
            id: true,
            email: true,
        },
    })

    const now = new Date()

    for (const user of usersToUpdate) {
        await prisma.user.update({
            data: {
                imageGenerationCount: 0,
                imageGenerationResetAt: now,
            },
            where: { id: user.id },
        })
    }
}

main()
```

---

## 🛡️ **Prevención Futura**

Para evitar este problema en el futuro:

### **Opción 1: Valores por Defecto en Prisma**
```prisma
model User {
  imageGenerationCount    Int      @default(0)
  imageGenerationResetAt  DateTime @default(now())
}
```
✅ Ya implementado

### **Opción 2: Migraciones Explícitas**

En lugar de `db push`, usar migraciones:
```bash
# Crear migración
npx prisma migrate dev --name add_image_fields

# Aplicar migración
npx prisma migrate deploy
```

### **Opción 3: Script de Migración Automático**

Crear un script que se ejecute automáticamente después de `db push`:
```json
// package.json
{
  "scripts": {
    "db:push": "prisma db push && tsx scripts/migrate-users.ts"
  }
}
```

---

## 🔄 **Si el Error Vuelve a Ocurrir**

### **Solución Rápida**:
```bash
npx tsx scripts/migrate-users.ts
```

### **Solución Manual (MongoDB)**:
```javascript
// En MongoDB Compass o shell
db.User.updateMany(
  { imageGenerationResetAt: null },
  { 
    $set: { 
      imageGenerationCount: 0,
      imageGenerationResetAt: new Date()
    }
  }
)
```

### **Solución Manual (Prisma Studio)**:
1. Abrir Prisma Studio: `npx prisma studio`
2. Ir a la tabla `User`
3. Filtrar por `imageGenerationResetAt` = `null`
4. Actualizar manualmente cada registro

---

## 📊 **Estado Actual**

| Campo | Estado | Valor |
|-------|--------|-------|
| `imageGenerationCount` | ✅ Actualizado | `0` |
| `imageGenerationResetAt` | ✅ Actualizado | Fecha actual |
| **Usuarios afectados** | ✅ Migrados | 3 usuarios |
| **Sistema** | ✅ Funcionando | Sin errores |

---

## 🎯 **Lecciones Aprendidas**

1. **Siempre migrar datos existentes** cuando se agregan campos no nulos
2. **Usar migraciones explícitas** en producción
3. **Tener scripts de migración** listos para deployment
4. **Probar con datos existentes** antes de hacer push

---

## ✅ **Verificación Final**

- ✅ Error resuelto
- ✅ 3 usuarios migrados exitosamente
- ✅ Homepage carga sin errores
- ✅ Sistema completamente funcional
- ✅ Script de migración disponible para futuros casos

---

**Archivo del script**: `scripts/migrate-users.ts`
**Fecha de resolución**: 2025-12-05
**Estado**: ✅ RESUELTO
