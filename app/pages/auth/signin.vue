<script setup lang="ts">
    import type { FormSubmitEvent } from '@nuxt/ui'

    import * as z from 'zod'

    definePageMeta({ layout: 'auth', middleware: 'guest' })

    useSeoMeta({
        description: 'Inicia sesión en tu cuenta para continuar',
        title: 'Iniciar Sesión',
    })

    const toast = useToast()
    const router = useRouter()

    const fields = [
        {
            label: 'Correo electrónico',
            name: 'email',
            placeholder: 'Ingresa tu correo electrónico',
            required: true,
            type: 'text' as const,
        },
        {
            label: 'Contraseña',
            name: 'password',
            placeholder: 'Ingresa tu contraseña',
            type: 'password' as const,
        },
        {
            label: 'Recordarme',
            name: 'remember',
            type: 'checkbox' as const,
        },
    ]

    const schema = z.object({
        email: z.email('Correo electrónico inválido'),
        password: z.string().min(8, 'Debe tener al menos 8 caracteres'),
    })

    type Schema = z.output<typeof schema>

    async function onSubmit(payload: FormSubmitEvent<Schema>) {
        const response = await $fetch('/api/auth/signin', {
            body: payload.data,
            method: 'POST',
        })

        toast.add({ color: 'success', title: response.message })

        router.push({ name: 'dashboard' })
    }
</script>

<template>
    <UAuthForm
        :fields="fields"
        icon="i-lucide-lock"
        :schema="schema"
        title="Bienvenido de nuevo"
        @submit="onSubmit"
    >
        <template #description>
            ¿No tienes una cuenta?
            <ULink
                class="text-primary font-medium"
                :to="{ name: 'auth-signup' }"
                >Regístrate</ULink
            >.
        </template>

        <template #password-hint>
            <ULink
                class="text-primary font-medium"
                tabindex="-1"
                to="/"
                >¿Olvidaste tu contraseña?</ULink
            >
        </template>

        <template #footer>
            Al iniciar sesión, aceptas nuestros
            <ULink
                class="text-primary font-medium"
                to="/"
                >Términos de Servicio</ULink
            >.
        </template>
    </UAuthForm>
</template>
