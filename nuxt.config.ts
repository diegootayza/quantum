// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
    compatibilityDate: '2025-07-15',
    css: ['~/assets/css/main.css'],
    devtools: { enabled: true },
    mdc: {
        headings: {
            anchorLinks: false,
        },
        highlight: {
            // noApiRoute: true
            shikiEngine: 'javascript',
        },
    },
    modules: ['@nuxt/eslint', 'nuxt-auth-utils', '@vueuse/nuxt', '@nuxt/ui', '@nuxtjs/mdc', '@nuxt/scripts'],
    vite: {
        plugins: [tailwindcss()],
    },
})
