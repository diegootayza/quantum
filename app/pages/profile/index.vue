<script setup lang="ts">
    definePageMeta({ layout: 'dashboard', middleware: 'auth' })

    const { user } = useUserSession()
</script>

<template>
    <UDashboardPanel
        id="setting"
        :ui="{ body: 'lg:py-12' }"
    >
        <template #header>
            <UDashboardNavbar title="Inicio">
                <template #leading>
                    <UDashboardSidebarCollapse />
                </template>
            </UDashboardNavbar>
        </template>

        <template #body>
            <div class="flex flex-col gap-4 sm:gap-6 lg:gap-12 w-full lg:max-w-2xl mx-auto">
                <div class="w-full flex items-center justify-center">
                    <h1 class="text-center text-4xl font-bold">Hola, {{ user?.name }} {{ user?.surname }}</h1>
                </div>
            </div>
        </template>
    </UDashboardPanel>
</template>
