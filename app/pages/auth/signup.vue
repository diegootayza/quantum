<script setup lang="ts">
    import type { FormSubmitEvent } from '@nuxt/ui'

    import * as z from 'zod'

    definePageMeta({ layout: 'auth', middleware: 'guest' })

    useSeoMeta({
        description: 'Crea una cuenta para comenzar',
        title: 'Registrarse',
    })

    const toast = useToast()
    const router = useRouter()

    const fields = [
        {
            label: 'Nombre',
            name: 'name',
            placeholder: 'Ingresa tu nombre',
            type: 'text' as const,
        },
        {
            label: 'Apellido',
            name: 'surname',
            placeholder: 'Ingresa tu apellido',
            type: 'text' as const,
        },
        {
            label: 'Correo electrónico',
            name: 'email',
            placeholder: 'Ingresa tu correo electrónico',
            type: 'text' as const,
        },
        {
            label: 'Contraseña',
            name: 'password',
            placeholder: 'Ingresa tu contraseña',
            type: 'password' as const,
        },
    ]

    const schema = z.object({
        email: z.email('Correo electrónico inválido'),
        name: z.string().min(1, 'El nombre es requerido'),
        password: z.string().min(8, 'Debe tener al menos 8 caracteres'),
        surname: z.string().min(1, 'El apellido es requerido'),
    })

    type Schema = z.output<typeof schema>

    async function onSubmit(payload: FormSubmitEvent<Schema>) {
        const response = await $fetch('/api/auth/signup', {
            body: payload.data,
            method: 'POST',
        })

        toast.add({ color: 'success', title: response.message })

        await router.push({ name: 'dashboard' })
    }
</script>

<template>
    <UAuthForm
        :fields="fields"
        :schema="schema"
        :submit="{ label: 'Crear cuenta' }"
        title="Crear una cuenta"
        @submit="onSubmit"
    >
        <template #description>
            ¿Ya tienes una cuenta?
            <ULink
                class="text-primary font-medium"
                :to="{ name: 'auth-signin' }"
                >Iniciar sesión</ULink
            >.
        </template>

        <template #footer>
            Al registrarte, aceptas nuestros
            <ULink
                class="text-primary font-medium"
                to="/"
            >
                Términos de Servicio.
            </ULink>
        </template>
    </UAuthForm>
</template>
