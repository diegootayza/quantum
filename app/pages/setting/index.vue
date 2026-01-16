<script setup lang="ts">
    import type { FormSubmitEvent } from '@nuxt/ui'

    import * as z from 'zod'

    useSeoMeta({
        description: 'Actualiza tu información personal',
        title: 'Información - Configuración',
    })

    const { user } = useUserSession()

    const profileSchema = z.object({
        email: z.email('Correo electrónico inválido'),
        name: z.string().min(2, 'Muy corto'),
        surname: z.string().min(2, 'Muy corto'),
    })

    type ProfileSchema = z.output<typeof profileSchema>

    const profile = reactive<Partial<ProfileSchema>>({
        email: user.value?.email ?? '',
        name: user.value?.name ?? '',
        surname: user.value?.surname ?? '',
    })

    const toast = useToast()

    async function onSubmit(event: FormSubmitEvent<ProfileSchema>) {
        toast.add({
            color: 'success',
            description: 'Tu configuración ha sido actualizada.',
            icon: 'i-lucide-check',
            title: 'Éxito',
        })
        console.log(event.data)
    }
</script>

<template>
    <UForm
        id="settings"
        :schema="profileSchema"
        :state="profile"
        @submit="onSubmit"
    >
        <UPageCard
            class="mb-4"
            description="Esta información se mostrará públicamente."
            orientation="horizontal"
            title="Información"
            variant="naked"
        >
            <UButton
                class="w-fit lg:ms-auto"
                color="neutral"
                form="settings"
                label="Guardar cambios"
                type="submit"
            />
        </UPageCard>

        <UPageCard variant="subtle">
            <UFormField
                class="flex max-sm:flex-col justify-between items-start gap-4"
                description="Aparecerá en recibos, facturas y otras comunicaciones."
                label="Nombre"
                name="name"
                required
            >
                <UInput
                    v-model="profile.name"
                    autocomplete="off"
                />
            </UFormField>
            <USeparator />
            <UFormField
                class="flex max-sm:flex-col justify-between items-start gap-4"
                description="Aparecerá en recibos, facturas y otras comunicaciones."
                label="Apellido"
                name="surname"
                required
            >
                <UInput
                    v-model="profile.surname"
                    autocomplete="off"
                />
            </UFormField>
            <USeparator />
            <UFormField
                class="flex max-sm:flex-col justify-between items-start gap-4"
                description="Usado para iniciar sesión."
                label="Correo electrónico"
                name="email"
                required
            >
                <UInput
                    v-model="profile.email"
                    autocomplete="off"
                    type="email"
                />
            </UFormField>
        </UPageCard>
    </UForm>
</template>
