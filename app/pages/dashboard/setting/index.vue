<script setup lang="ts">
    definePageMeta({ layout: 'dashboard', middleware: ['auth', 'admin'] })

    useSeoMeta({
        description: 'Panel de administración del sistema',
        title: 'Configuración - Panel de control',
    })
</script>

<template>
    <UDashboardPanel id="dashboard-setting">
        <template #header>
            <UDashboardNavbar title="Configuración">
                <template #leading>
                    <UDashboardSidebarCollapse />
                </template>
            </UDashboardNavbar>
        </template>
        <template #body>
            <SettingGlobal />
        </template>
    </UDashboardPanel>
</template>
