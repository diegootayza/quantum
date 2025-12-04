<script setup lang="ts">
    import type { FormError } from '@nuxt/ui'

    import * as z from 'zod'

    definePageMeta({ layout: 'dashboard', middleware: 'auth' })

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
</script>

<template>
    <UDashboardPanel
        id="setting"
        :ui="{ body: 'lg:py-12' }"
    >
        <template #header>
            <UDashboardNavbar title="Configuración">
                <template #leading>
                    <UDashboardSidebarCollapse />
                </template>
            </UDashboardNavbar>
        </template>

        <template #body>
            <div class="flex flex-col gap-4 sm:gap-6 lg:gap-12 w-full lg:max-w-2xl mx-auto">
                <UPageCard
                    description="Confirma tu contraseña actual antes de establecer una nueva."
                    title="Contraseña"
                    variant="subtle"
                >
                    <UForm
                        class="flex flex-col gap-4 max-w-xs"
                        :schema="passwordSchema"
                        :state="password"
                        :validate="validate"
                    >
                        <UFormField name="current">
                            <UInput
                                v-model="password.current"
                                class="w-full"
                                placeholder="Contraseña actual"
                                type="password"
                            />
                        </UFormField>

                        <UFormField name="new">
                            <UInput
                                v-model="password.new"
                                class="w-full"
                                placeholder="Nueva contraseña"
                                type="password"
                            />
                        </UFormField>

                        <UButton
                            class="w-fit"
                            label="Actualizar"
                            type="submit"
                        />
                    </UForm>
                </UPageCard>

                <UPageCard
                    class="bg-linear-to-tl from-error/10 from-5% to-default"
                    description="¿Ya no quieres usar nuestro servicio? Puedes eliminar tu cuenta aquí. Esta acción no es reversible. Toda la información relacionada con esta cuenta se eliminará permanentemente."
                    title="Cuenta"
                >
                    <template #footer>
                        <ModalDelete
                            description="Estas a punto de eliminar esto permanentemente."
                            title="Eliminar"
                        >
                            <UButton
                                color="error"
                                label="Eliminar cuenta"
                            />
                        </ModalDelete>
                    </template>
                </UPageCard>
            </div>
        </template>
    </UDashboardPanel>
</template>
