<script setup lang="ts">
    definePageMeta({ layout: 'dashboard', middleware: 'auth' })
</script>

<template>
    <UDashboardPanel id="dashboard">
        <template #header>
            <UDashboardNavbar title="Panel de control">
                <template #leading>
                    <UDashboardSidebarCollapse />
                </template>
            </UDashboardNavbar>
        </template>
        <template #body>
            <UPageGrid class="lg:grid-cols-4 gap-6">
                <UPageCard
                    title="Suscripciones activas"
                    :ui="{
                        title: 'font-normal text-muted text-xs uppercase',
                    }"
                >
                    <div class="flex items-center gap-2">
                        <span class="text-2xl font-semibold text-highlighted"> 40000 </span>
                    </div>
                </UPageCard>
                <UPageCard
                    title="Ingresos recurrentes"
                    :ui="{
                        title: 'font-normal text-muted text-xs uppercase',
                    }"
                >
                    <div class="flex items-center gap-2">
                        <span class="text-2xl font-semibold text-highlighted"> 40000 </span>
                    </div>
                </UPageCard>
                <UPageCard
                    title="Nuevas suscripciones"
                    :ui="{
                        title: 'font-normal text-muted text-xs uppercase',
                    }"
                >
                    <div class="flex items-center gap-2">
                        <span class="text-2xl font-semibold text-highlighted"> 40000 </span>
                    </div>
                </UPageCard>
                <UPageCard
                    title="Tasa de cancelación"
                    :ui="{
                        title: 'font-normal text-muted text-xs uppercase',
                    }"
                >
                    <div class="flex items-center gap-2">
                        <span class="text-2xl font-semibold text-highlighted"> 40000 </span>
                    </div>
                </UPageCard>
            </UPageGrid>
        </template>
    </UDashboardPanel>
</template>
