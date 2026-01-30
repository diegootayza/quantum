<script setup lang="ts">
    import type { NuxtError } from '#app'

    import { es } from '@nuxt/ui/locale'

    interface Props {
        error: NuxtError
    }

    const props = withDefaults(defineProps<Props>(), {})

    const { loggedIn } = useUserSession()

    const redirect = computed(() => {
        if (loggedIn.value) return '/profile'
        return '/'
    })
</script>

<template>
    <UApp :locale="es">
        <UError
            :error="props.error"
            :redirect="redirect"
        />
    </UApp>
</template>
