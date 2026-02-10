import type { BadgeProps } from '@nuxt/ui'

export function mapFileType(type: string): { color: BadgeProps['color']; label: string } {
    const data: RecordType<{ color: BadgeProps['color']; label: string }> = {
        generated: { color: 'success', label: 'Generado' },
        upload: { color: 'info', label: 'Cargado' },
    }

    return data[type] ?? { color: 'error', label: 'Desconocido' }
}

export function mapUserRole(role: string): { color: BadgeProps['color']; label: string } {
    const data: RecordType<{ color: BadgeProps['color']; label: string }> = {
        ADMIN: { color: 'success', label: 'Administrador' },
        USER: { color: 'info', label: 'Usuario' },
    }

    return data[role] ?? { color: 'error', label: 'Desconocido' }
}
