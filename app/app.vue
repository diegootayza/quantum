<script setup lang="ts">
    import { es } from '@nuxt/ui/locale'

    const colorMode = useColorMode()

    const color = computed(() => (colorMode.value === 'dark' ? '#1b1718' : 'white'))

    useHead({
        htmlAttrs: {
            lang: 'es',
        },
        link: [{ href: '/favicon.ico', rel: 'icon' }],
        meta: [{ charset: 'utf-8' }, { content: 'width=device-width, initial-scale=1', name: 'viewport' }, { content: color, key: 'theme-color', name: 'theme-color' }],
    })

    const title = 'Quantum'
    const description = 'A professional dashboard template built with Nuxt UI, featuring multiple pages, data visualization, and comprehensive management capabilities for creating powerful admin interfaces.'

    useSeoMeta({
        description,
        ogDescription: description,
        ogImage: 'https://ui.nuxt.com/assets/templates/nuxt/dashboard-light.png',
        ogTitle: title,
        title,
        twitterCard: 'summary_large_image',
        twitterImage: 'https://ui.nuxt.com/assets/templates/nuxt/dashboard-light.png',
    })
</script>

<template>
    <UApp :locale="es">
        <NuxtLoadingIndicator />

        <NuxtLayout>
            <NuxtPage />
        </NuxtLayout>
        <CommonConfirmModal />
        <CommonInputModal />
    </UApp>
</template>
