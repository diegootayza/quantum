/**
 * Servicio de notificaciones para límites de generación de imágenes
 */

interface EmailNotification {
    email: string
    limit: number
    name: string
    remaining: number
    resetAt: Date
    type: 'limit_reached' | 'warning'
    used: number
}

/**
 * Obtiene plantilla de email para límite alcanzado
 */
export function getLimitReachedEmailTemplate(notification: EmailNotification): string {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
        .alert-box { background: #fee2e2; border-left: 4px solid #ef4444; padding: 15px; margin: 20px 0; border-radius: 5px; }
        .stats { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .stat-item { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
        .button { display: inline-block; background: #ef4444; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚫 Límite de Imágenes Alcanzado</h1>
        </div>
        <div class="content">
            <p>Hola <strong>${notification.name}</strong>,</p>
            
            <div class="alert-box">
                <p><strong>Has alcanzado tu límite de generación de imágenes.</strong></p>
                <p>No podrás generar más imágenes hasta que se reinicie tu contador el <strong>${new Date(notification.resetAt).toLocaleDateString()}</strong>.</p>
            </div>

            <div class="stats">
                <h3>Resumen de Uso</h3>
                <div class="stat-item">
                    <span>Imágenes Generadas:</span>
                    <strong>${notification.used} / ${notification.limit}</strong>
                </div>
                <div class="stat-item">
                    <span>Reinicio del Contador:</span>
                    <strong>${new Date(notification.resetAt).toLocaleDateString()}</strong>
                </div>
            </div>

            <p><strong>¿Necesitas más imágenes?</strong></p>
            <p>Actualiza tu plan para obtener un límite mayor y seguir creando contenido increíble.</p>

            <a href="${useRuntimeConfig().public.appUrl}/profile/subscription" class="button">
                Actualizar Plan
            </a>

            <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
                Este es un mensaje automático. Si tienes preguntas, contacta a soporte.
            </p>
        </div>
    </div>
</body>
</html>
    `
}

/**
 * Obtiene plantilla de email para advertencia
 */
export function getWarningEmailTemplate(notification: EmailNotification): string {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
        .warning-box { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 5px; }
        .stats { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .stat-item { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
        .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>⚠️ Advertencia de Límite de Imágenes</h1>
        </div>
        <div class="content">
            <p>Hola <strong>${notification.name}</strong>,</p>
            
            <div class="warning-box">
                <p><strong>Estás cerca de alcanzar tu límite de generación de imágenes.</strong></p>
                <p>Te quedan solo <strong>${notification.remaining} imágenes</strong> disponibles.</p>
            </div>

            <div class="stats">
                <h3>Estadísticas de Uso</h3>
                <div class="stat-item">
                    <span>Imágenes Usadas:</span>
                    <strong>${notification.used}</strong>
                </div>
                <div class="stat-item">
                    <span>Límite Total:</span>
                    <strong>${notification.limit}</strong>
                </div>
                <div class="stat-item">
                    <span>Imágenes Restantes:</span>
                    <strong>${notification.remaining}</strong>
                </div>
                <div class="stat-item">
                    <span>Reinicia el:</span>
                    <strong>${new Date(notification.resetAt).toLocaleDateString()}</strong>
                </div>
            </div>

            <p>Considera actualizar tu plan si necesitas generar más imágenes.</p>

            <a href="${useRuntimeConfig().public.appUrl}/profile/subscription" class="button">
                Ver Planes Disponibles
            </a>

            <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
                Este es un mensaje automático. Si tienes preguntas, contacta a soporte.
            </p>
        </div>
    </div>
</body>
</html>
    `
}

/**
 * Envía notificación cuando un usuario alcanza el límite
 */
export async function sendImageLimitReached(userId: string) {
    const user = await prisma.user.findUnique({
        select: {
            email: true,
            imageGenerationCount: true,
            imageGenerationResetAt: true,
            name: true,
            subscription: {
                select: {
                    imageGenerationLimit: true,
                    interval: true,
                },
            },
            surname: true,
        },
        where: { id: userId },
    })

    if (!user || !user.subscription) return

    const notification: EmailNotification = {
        email: user.email,
        limit: user.subscription.imageGenerationLimit,
        name: `${user.name} ${user.surname}`,
        remaining: 0,
        resetAt: user.imageGenerationResetAt,
        type: 'limit_reached',
        used: user.imageGenerationCount,
    }

    console.log('📧 Enviando notificación de límite alcanzado:', notification)

    try {
        await $fetch(useRuntimeConfig().n8nWebhook, {
            body: {
                event: 'image_limit_reached',
                ...notification,
            },
            method: 'POST',
        })
    } catch (error) {
        console.error('Error enviando notificación:', error)
    }
}

/**
 * Envía notificación cuando un usuario está cerca del límite
 */
export async function sendImageLimitWarning(userId: string) {
    const user = await prisma.user.findUnique({
        select: {
            email: true,
            imageGenerationCount: true,
            imageGenerationResetAt: true,
            name: true,
            subscription: {
                select: {
                    imageGenerationLimit: true,
                },
            },
            surname: true,
        },
        where: { id: userId },
    })

    if (!user || !user.subscription) return

    const remaining = user.subscription.imageGenerationLimit - user.imageGenerationCount
    const percentage = (user.imageGenerationCount / user.subscription.imageGenerationLimit) * 100

    // Solo notificar si está entre 80% y 90% (para no spam)
    if (percentage >= 80 && percentage < 90) {
        const notification: EmailNotification = {
            email: user.email,
            limit: user.subscription.imageGenerationLimit,
            name: `${user.name} ${user.surname}`,
            remaining,
            resetAt: user.imageGenerationResetAt,
            type: 'warning',
            used: user.imageGenerationCount,
        }

        // Aquí integrarías con tu servicio de email (SendGrid, Resend, etc.)
        console.log('📧 Enviando notificación de advertencia:', notification)

        // Ejemplo con n8n webhook (si lo tienes configurado)
        try {
            await $fetch(useRuntimeConfig().n8nWebhook, {
                body: {
                    event: 'image_limit_warning',
                    ...notification,
                },
                method: 'POST',
            })
        } catch (error) {
            console.error('Error enviando notificación:', error)
        }
    }
}
