<script setup lang="ts">
    definePageMeta({ layout: 'dashboard', middleware: ['auth', 'admin'] })

    useSeoMeta({
        description: 'Panel de administración del sistema',
        title: 'Panel de Control',
    })

    const { data: stats, pending } = await useFetch('/api/dashboard/stats')

    const userGrowthData: any[] = []

    const statsCards = [
        {
            subtitle: `${stats.value?.stats.activeUsers || 0} activos`,
            title: 'Total Usuarios',
            value: stats.value?.stats.totalUsers || 0,
        },

        {
            subtitle: `${stats.value?.stats.conversationsLast30Days || 0} últimos 30 días`,
            title: 'Conversaciones',
            value: stats.value?.stats.totalConversations || 0,
        },
        {
            subtitle: 'Total procesados',
            title: 'Mensajes',
            value: stats.value?.stats.totalMessages || 0,
        },
    ]
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
            <div
                v-if="pending"
                class="flex justify-center items-center h-64"
            >
                <UIcon
                    class="animate-spin w-10 h-10 text-primary-500"
                    name="i-lucide-loader-2"
                />
            </div>

            <div
                v-else
                class="space-y-6"
            >
                <!-- Stats Cards -->
                <UPageGrid class="lg:grid-cols-4 gap-6">
                    <UPageCard
                        v-for="card in statsCards"
                        :key="card.title"
                        :title="card.title"
                        :ui="{
                            title: 'font-normal text-muted text-xs uppercase',
                        }"
                    >
                        <div class="flex flex-col gap-1">
                            <span class="text-3xl font-semibold text-highlighted">{{ card.value }}</span>
                            <span class="text-xs text-muted">{{ card.subtitle }}</span>
                        </div>
                    </UPageCard>
                </UPageGrid>

                <!-- Charts Section -->
                <UPageGrid class="lg:grid-cols-2 gap-6">
                    <!-- User Growth Chart -->
                    <UPageCard
                        title="Crecimiento de Usuarios"
                        :ui="{
                            title: 'font-semibold text-base',
                            body: 'p-4 sm:p-6',
                        }"
                    >
                        <div
                            v-if="userGrowthData.length > 0"
                            class="space-y-4"
                        >
                            <div
                                v-for="item in userGrowthData"
                                :key="item.month"
                                class="flex items-center gap-4"
                            >
                                <div class="flex-1">
                                    <div class="flex justify-between items-center mb-1">
                                        <span class="text-sm font-medium">{{ item.month }}</span>
                                        <span class="text-sm text-muted">{{ item.users }}</span>
                                    </div>
                                    <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                        <div
                                            class="bg-primary-500 h-2 rounded-full transition-all duration-300"
                                            :style="{ width: `${(item.users / Math.max(...userGrowthData.map((d) => d.users))) * 100}%` }"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div
                            v-else
                            class="text-center text-muted py-8"
                        >
                            No hay datos disponibles
                        </div>
                    </UPageCard>
                </UPageGrid>
            </div>
        </template>
    </UDashboardPanel>
</template>
