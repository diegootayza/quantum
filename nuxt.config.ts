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
            // noApiRoute: true
            shikiEngine: 'javascript',
        },
    },
    modules: ['@nuxt/eslint', 'nuxt-auth-utils', '@pinia/nuxt', '@vueuse/nuxt', '@vee-validate/nuxt', '@nuxt/ui', '@nuxtjs/mdc', '@nuxt/scripts'],
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
        typeCheck: true,
    },
    vite: {
        build: {
            chunkSizeWarningLimit: 1024,
        },
        plugins: [tailwindcss()],
    },
})
