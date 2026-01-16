<script setup lang="ts">
    import type { FormError, FormSubmitEvent } from '@nuxt/ui'

    import * as z from 'zod'

    definePageMeta({ layout: 'dashboard', middleware: 'auth' })

    const toast = useToast()
    const loading = ref(false)
    const { safeExecute } = useSafeError()

    const securityTips = [
        {
            bgClass: 'bg-green-100 dark:bg-green-900/30',
            description: 'Usa al menos 8 caracteres con letras, números y símbolos',
            icon: 'i-lucide-check-circle',
            iconClass: 'text-green-600 dark:text-green-400',
            title: 'Contraseña segura',
        },
        {
            bgClass: 'bg-blue-100 dark:bg-blue-900/30',
            description: 'No compartas tu contraseña con nadie',
            icon: 'i-lucide-eye-off',
            iconClass: 'text-blue-600 dark:text-blue-400',
            title: 'Mantén privacidad',
        },
        {
            bgClass: 'bg-purple-100 dark:bg-purple-900/30',
            description: 'Cambia tu contraseña periódicamente',
            icon: 'i-lucide-refresh-cw',
            iconClass: 'text-purple-600 dark:text-purple-400',
            title: 'Actualiza seguido',
        },
    ]

    const passwordSchema = z.object({
        current: z.string().min(8, 'Debe tener al menos 8 caracteres'),
        new: z.string().min(8, 'Debe tener al menos 8 caracteres'),
    })

    type PasswordSchema = z.output<typeof passwordSchema>

    const password = reactive<Partial<PasswordSchema>>({
        current: undefined,
        new: undefined,
    })

    const validate = (state: Partial<PasswordSchema>): FormError[] => {
        const errors: FormError[] = []
        if (state.current && state.new && state.current === state.new) {
            errors.push({ message: 'Las contraseñas deben ser diferentes', name: 'new' })
        }
        return errors
    }

    async function onSubmit(event: FormSubmitEvent<PasswordSchema>) {
        loading.value = true

        const success = await safeExecute(async () => {
            await $fetch('/api/user/password', {
                body: {
                    currentPassword: event.data.current,
                    newPassword: event.data.new,
                },
                method: 'POST',
            })

            toast.add({
                color: 'success',
                description: 'Tu contraseña ha sido cambiada exitosamente',
                title: 'Contraseña actualizada',
            })

            // Reset form
            password.current = undefined
            password.new = undefined

            return true
        })

        loading.value = false
    }
</script>

<template>
    <UDashboardPanel
        id="setting"
        :ui="{ body: 'lg:py-12' }"
    >
        <template #header>
            <UDashboardNavbar>
                <template #leading>
                    <UDashboardSidebarCollapse />
                </template>
            </UDashboardNavbar>
        </template>

        <template #body>
            <div class="flex flex-col gap-6 w-full max-w-4xl mx-auto px-4">
                <!-- Header Section -->
                <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Seguridad de la Cuenta</h1>

                <!-- Security Tips -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div
                        v-for="tip in securityTips"
                        :key="tip.title"
                        class="flex items-start gap-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700"
                    >
                        <div
                            class="rounded-full shrink-0 size-10 flex items-center justify-center"
                            :class="tip.bgClass"
                        >
                            <UIcon
                                class="size-5"
                                :class="tip.iconClass"
                                :name="tip.icon"
                            />
                        </div>
                        <div>
                            <p class="font-medium text-sm text-gray-900 dark:text-white">{{ tip.title }}</p>
                            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">{{ tip.description }}</p>
                        </div>
                    </div>
                </div>

                <!-- Password Change Card -->
                <UPageCard
                    :ui="{
                        body: 'p-6',
                        header: 'p-6 pb-0',
                    }"
                >
                    <template #header>
                        <div class="flex items-center gap-4">
                            <div class="rounded-full bg-blue-100 dark:bg-blue-900/30 p-3">
                                <UIcon
                                    class="size-6 text-blue-600 dark:text-blue-400"
                                    name="i-lucide-key-round"
                                />
                            </div>
                            <div>
                                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Cambiar Contraseña</h3>
                                <p class="text-sm text-gray-500 dark:text-gray-400">Confirma tu contraseña actual antes de establecer una nueva</p>
                            </div>
                        </div>
                    </template>

                    <UForm
                        class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6"
                        :schema="passwordSchema"
                        :state="password"
                        :validate="validate"
                        @submit="onSubmit"
                    >
                        <UFormField
                            label="Contraseña actual"
                            name="current"
                        >
                            <UInput
                                v-model="password.current"
                                class="w-full"
                                :disabled="loading"
                                icon="i-lucide-lock"
                                placeholder="Ingresa tu contraseña actual"
                                type="password"
                            />
                        </UFormField>

                        <UFormField
                            label="Nueva contraseña"
                            name="new"
                        >
                            <UInput
                                v-model="password.new"
                                class="w-full"
                                :disabled="loading"
                                icon="i-lucide-lock-keyhole"
                                placeholder="Ingresa tu nueva contraseña"
                                type="password"
                            />
                        </UFormField>

                        <div class="md:col-span-2 flex justify-end">
                            <UButton
                                :disabled="loading"
                                icon="i-lucide-save"
                                label="Actualizar contraseña"
                                :loading="loading"
                                size="lg"
                                type="submit"
                            />
                        </div>
                    </UForm>
                </UPageCard>

                <!-- Danger Zone -->
                <UPageCard
                    class="border-red-200 dark:border-red-900/50"
                    :ui="{
                        body: 'p-6',
                        header: 'p-6 pb-0',
                    }"
                >
                    <template #header>
                        <div class="flex items-center gap-4">
                            <div class="rounded-full bg-red-100 dark:bg-red-900/30 p-3">
                                <UIcon
                                    class="size-6 text-red-600 dark:text-red-400"
                                    name="i-lucide-alert-triangle"
                                />
                            </div>
                            <div>
                                <h3 class="text-lg font-semibold text-red-600 dark:text-red-400">Zona de Peligro</h3>
                                <p class="text-sm text-gray-500 dark:text-gray-400">Acciones irreversibles para tu cuenta</p>
                            </div>
                        </div>
                    </template>

                    <div class="mt-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30">
                        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div class="flex items-start gap-3">
                                <UIcon
                                    class="size-5 text-red-500 mt-0.5 shrink-0"
                                    name="i-lucide-trash-2"
                                />
                                <div>
                                    <p class="font-medium text-gray-900 dark:text-white">Eliminar cuenta permanentemente</p>
                                    <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Esta acción eliminará todos tus datos, conversaciones, archivos y configuraciones. No podrás recuperar tu cuenta.</p>
                                </div>
                            </div>
                            <ModalDelete
                                description="Estas a punto de eliminar tu cuenta y todos tus datos permanentemente. Esta acción no se puede deshacer."
                                title="Eliminar cuenta"
                            >
                                <UButton
                                    class="shrink-0"
                                    color="error"
                                    icon="i-lucide-trash-2"
                                    label="Eliminar cuenta"
                                    variant="soft"
                                />
                            </ModalDelete>
                        </div>
                    </div>
                </UPageCard>
            </div>
        </template>
    </UDashboardPanel>
</template>
