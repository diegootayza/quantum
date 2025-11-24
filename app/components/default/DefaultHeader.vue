<script setup lang="ts">
    const route = useRoute()

    const items = computed(() => [
        {
            active: route.path.startsWith('/docs'),
            label: 'Docs',
            to: '/',
        },
        {
            label: 'Pricing',
            to: '/',
        },
        {
            label: 'Blog',
            to: '/',
        },
        {
            label: 'Changelog',
            to: '/',
        },
    ])
</script>

<template>
    <UHeader>
        <template #left>
            <NuxtLink to="/"> Quantum </NuxtLink>
        </template>

        <UNavigationMenu
            :items="items"
            variant="link"
        />

        <template #right>
            <UColorModeButton />

            <UButton
                class="lg:hidden"
                color="neutral"
                icon="i-lucide-log-in"
                to="/"
                variant="ghost"
            />

            <UButton
                class="hidden lg:inline-flex"
                color="neutral"
                label="Iniciar sesión"
                :to="{ name: 'auth-signin' }"
                variant="outline"
            />

            <UButton
                class="hidden lg:inline-flex"
                color="neutral"
                label="Registrarse"
                :to="{ name: 'auth-signup' }"
            />
        </template>

        <template #body>
            <UNavigationMenu
                class="-mx-2.5"
                :items="items"
                orientation="vertical"
            />

            <USeparator class="my-6" />

            <UButton
                block
                class="mb-3"
                color="neutral"
                label="Iniciar sesión"
                :to="{ name: 'auth-signin' }"
                variant="subtle"
            />
            <UButton
                block
                color="neutral"
                label="Registrarse"
                :to="{ name: 'auth-signup' }"
            />
        </template>
    </UHeader>
</template>
