// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
    compatibilityDate: '2025-07-15',
    css: ['~/assets/css/main.css'],
    devtools: { enabled: true },
    experimental: {
        viewTransition: true,
    },
    mdc: {
        headings: {
            anchorLinks: false,
        },
        highlight: {
            shikiEngine: 'javascript',
        },
    },
    modules: ['@nuxt/ui', '@nuxt/eslint', '@pinia/nuxt', 'nuxt-auth-utils', '@vee-validate/nuxt', '@vueuse/nuxt', '@nuxtjs/mdc', '@nuxt/scripts'],
    nitro: {
        preset: process.env.NODE_ENV === 'production' ? 'bun' : 'node-server',
    },
    runtimeConfig: {
        public: {
            appVersion: process.env.CAPROVER_GIT_COMMIT_SHA || 'dev',
            connectUrl: process.env.CONNECT_URL || 'http://localhost:4000',
        },
    },
    sourcemap: { client: false, server: false },
    typescript: {
        typeCheck: process.env.NODE_ENV === 'production' ? false : true,
    },
    vite: {
        build: {
            chunkSizeWarningLimit: 1024,
        },
        plugins: [tailwindcss()],
    },
})
