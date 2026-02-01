<script setup lang="ts">
    import { es } from '@nuxt/ui/locale'

    const colorMode = useColorMode()

    const color = computed(() => (colorMode.value === 'dark' ? '#1b1718' : 'white'))

    useHead({
        htmlAttrs: {
            lang: 'es',
        },
        link: [{ href: '/favicon.svg', rel: 'icon', type: 'image/svg+xml' }],
        meta: [
            {
                charset: 'utf-8',
            },
            {
                content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
                name: 'viewport',
            },
            {
                content: color,
                key: 'theme-color',
                name: 'theme-color',
            },
        ],
        titleTemplate(title) {
            return title ? `${title} - Quantum` : 'Quantum'
        },
    })

    const title = 'Quantum Clic'
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
        <NuxtLoadingIndicator color="var(--ui-primary)" />

        <NuxtLayout>
            <NuxtPage />
        </NuxtLayout>
        <CommonConfirmModal />
        <CommonImageModal />
        <CommonInputModal />
    </UApp>
</template>
