<script setup lang="ts">
    import type { NuxtError } from '#app'

    import { es } from '@nuxt/ui/locale'

    const props = defineProps<{ error: NuxtError }>()
</script>

<template>
    <UApp :locale="es">
        <div class="h-screen items-center justify-center flex flex-col gap-4">
            <h1>{{ props.error.statusMessage }}</h1>
            <NuxtLink to="/">Go back home</NuxtLink>
        </div>
    </UApp>
</template>
