<script setup lang="ts">
    import type { FormSubmitEvent } from '@nuxt/ui'

    import * as z from 'zod'

    const fileRef = ref<HTMLInputElement>()

    const profileSchema = z.object({
        avatar: z.string().optional(),
        bio: z.string().optional(),
        email: z.string().email('Correo electrónico inválido'),
        name: z.string().min(2, 'Muy corto'),
        username: z.string().min(2, 'Muy corto'),
    })

    type ProfileSchema = z.output<typeof profileSchema>

    const profile = reactive<Partial<ProfileSchema>>({
        avatar: undefined,
        bio: undefined,
        email: 'ben@nuxtlabs.com',
        name: 'Benjamin Canac',
        username: 'benjamincanac',
    })
    const toast = useToast()
    function onFileChange(e: Event) {
        const input = e.target as HTMLInputElement

        if (!input.files?.length) {
            return
        }

        profile.avatar = URL.createObjectURL(input.files[0]!)
    }

    function onFileClick() {
        fileRef.value?.click()
    }

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
            title="Perfil"
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
                description="Usado para iniciar sesión, recibos por correo y actualizaciones de productos."
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
            <USeparator />
            <UFormField
                class="flex max-sm:flex-col justify-between items-start gap-4"
                description="Tu nombre de usuario único para iniciar sesión y la URL de tu perfil."
                label="Nombre de usuario"
                name="username"
                required
            >
                <UInput
                    v-model="profile.username"
                    autocomplete="off"
                    type="username"
                />
            </UFormField>
            <USeparator />
            <UFormField
                class="flex max-sm:flex-col justify-between sm:items-center gap-4"
                description="JPG, GIF o PNG. Máximo 1MB."
                label="Avatar"
                name="avatar"
            >
                <div class="flex flex-wrap items-center gap-3">
                    <UAvatar
                        :alt="profile.name"
                        size="lg"
                        :src="profile.avatar"
                    />
                    <UButton
                        color="neutral"
                        label="Elegir"
                        @click="onFileClick"
                    />
                    <input
                        ref="fileRef"
                        accept=".jpg, .jpeg, .png, .gif"
                        class="hidden"
                        type="file"
                        @change="onFileChange"
                    />
                </div>
            </UFormField>
            <USeparator />
            <UFormField
                class="flex max-sm:flex-col justify-between items-start gap-4"
                description="Breve descripción para tu perfil. Las URLs se convierten en hipervínculos."
                label="Biografía"
                name="bio"
                :ui="{ container: 'w-full' }"
            >
                <UTextarea
                    v-model="profile.bio"
                    autoresize
                    class="w-full"
                    :rows="5"
                />
            </UFormField>
        </UPageCard>
    </UForm>
</template>
