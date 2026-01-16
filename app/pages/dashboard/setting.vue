<script setup lang="ts">
    import type { NavigationMenuItem } from '@nuxt/ui'

    definePageMeta({ layout: 'dashboard', middleware: ['auth', 'admin'] })

    useSeoMeta({
        description: 'Configuración del sistema',
        title: 'Configuración - Admin',
    })

    const links = [
        [
            // {
            //     exact: true,
            //     icon: 'i-lucide-user',
            //     label: 'General',
            //     to: { name: 'dashboard-setting' },
            // },
            {
                icon: 'lucide:brain',
                label: 'IA',
                to: { name: 'dashboard-setting-ai' },
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
                <!-- NOTE: The `-mx-1` class is used to align with the `DashboardSidebarCollapse` button here. -->
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
