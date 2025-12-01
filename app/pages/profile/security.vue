<script setup lang="ts">
    definePageMeta({ layout: 'dashboard', middleware: 'auth' })
</script>

<template>
    <UDashboardPanel id="security">
        <template #header>
            <UDashboardNavbar title="Configuración - Seguridad">
                <template #leading>
                    <UDashboardSidebarCollapse />
                </template>
            </UDashboardNavbar>
        </template>
        <template #body>
            <UContainer class="flex-1 flex flex-col justify-center items-center gap-6">
                <UIcon
                    class="size-20"
                    name="lucide:construction"
                />
                <h1 class="text-2xl sm:text-4xl text-center text-highlighted font-bold">Esta pagina se encuentra en construcción</h1>
            </UContainer>
        </template>
    </UDashboardPanel>
</template>
