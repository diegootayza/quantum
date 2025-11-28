<script setup lang="ts">
    import type { NavigationMenuItem } from '@nuxt/ui'

    definePageMeta({ layout: 'dashboard', middleware: 'auth' })

    const links = [
        [
            {
                exact: true,
                icon: 'lucide:user',
                label: 'información',
                to: { name: 'setting' },
            },
            {
                exact: true,
                icon: 'lucide:brain',
                label: 'IA',
                to: { name: 'setting-ai' },
            },
            {
                icon: 'lucide:shield',
                label: 'Seguridad',
                to: { name: 'setting-security' },
            },
        ],
    ] satisfies NavigationMenuItem[][]
</script>

<template>
    <UDashboardPanel
        id="setting"
        :ui="{ body: 'lg:py-12' }"
    >
        <template #header>
            <UDashboardNavbar title="Configuración">
                <template #leading>
                    <UDashboardSidebarCollapse />
                </template>
            </UDashboardNavbar>

            <UDashboardToolbar>
                <UNavigationMenu
                    class="-mx-1 flex-1"
                    highlight
                    :items="links"
                />
            </UDashboardToolbar>
        </template>

        <template #body>
            <div class="flex flex-col gap-4 sm:gap-6 lg:gap-12 w-full lg:max-w-2xl mx-auto">
                <NuxtPage />
            </div>
        </template>
    </UDashboardPanel>
</template>
