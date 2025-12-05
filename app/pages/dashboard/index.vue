<script setup lang="ts">
    definePageMeta({ layout: 'dashboard', middleware: ['auth', 'admin'] })

    const { data: stats, pending } = await useFetch('/api/dashboard/stats')

    const userGrowthData = computed(() => {
        if (!stats.value?.charts.userGrowth) return []
        
        const monthlyData = new Map<string, number>()
        
        stats.value.charts.userGrowth.forEach((item: any) => {
            const date = new Date(item.createdAt)
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
            monthlyData.set(monthKey, (monthlyData.get(monthKey) || 0) + item._count)
        })
        
        return Array.from(monthlyData.entries())
            .sort((a, b) => a[0].localeCompare(b[0]))
            .map(([month, count]) => ({
                month: new Date(month + '-01').toLocaleDateString('es-ES', { month: 'short', year: 'numeric' }),
                users: count
            }))
    })

    const subscriptionChartData = computed(() => {
        if (!stats.value?.charts.subscriptionDistribution) return []
        return stats.value.charts.subscriptionDistribution
    })
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
            <div v-if="pending" class="flex justify-center items-center h-64">
                <UIcon name="i-lucide-loader-2" class="animate-spin w-10 h-10 text-primary-500" />
            </div>
            
            <div v-else class="space-y-6">
                <!-- Stats Cards -->
                <UPageGrid class="lg:grid-cols-4 gap-6">
                    <UPageCard
                        title="Total Usuarios"
                        :ui="{
                            title: 'font-normal text-muted text-xs uppercase',
                        }"
                    >
                        <div class="flex flex-col gap-1">
                            <span class="text-3xl font-semibold text-highlighted">{{ stats?.stats.totalUsers || 0 }}</span>
                            <span class="text-xs text-muted">{{ stats?.stats.activeUsers || 0 }} activos</span>
                        </div>
                    </UPageCard>
                    
                    <UPageCard
                        title="Suscripciones"
                        :ui="{
                            title: 'font-normal text-muted text-xs uppercase',
                        }"
                    >
                        <div class="flex flex-col gap-1">
                            <span class="text-3xl font-semibold text-highlighted">{{ stats?.stats.usersWithSubscription || 0 }}</span>
                            <span class="text-xs text-muted">de {{ stats?.stats.totalUsers || 0 }} usuarios</span>
                        </div>
                    </UPageCard>
                    
                    <UPageCard
                        title="Conversaciones"
                        :ui="{
                            title: 'font-normal text-muted text-xs uppercase',
                        }"
                    >
                        <div class="flex flex-col gap-1">
                            <span class="text-3xl font-semibold text-highlighted">{{ stats?.stats.totalConversations || 0 }}</span>
                            <span class="text-xs text-muted">{{ stats?.stats.conversationsLast30Days || 0 }} últimos 30 días</span>
                        </div>
                    </UPageCard>
                    
                    <UPageCard
                        title="Mensajes"
                        :ui="{
                            title: 'font-normal text-muted text-xs uppercase',
                        }"
                    >
                        <div class="flex flex-col gap-1">
                            <span class="text-3xl font-semibold text-highlighted">{{ stats?.stats.totalMessages || 0 }}</span>
                            <span class="text-xs text-muted">Total procesados</span>
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
                            body: { padding: 'p-4 sm:p-6' }
                        }"
                    >
                        <div v-if="userGrowthData.length > 0" class="space-y-4">
                            <div v-for="item in userGrowthData" :key="item.month" class="flex items-center gap-4">
                                <div class="flex-1">
                                    <div class="flex justify-between items-center mb-1">
                                        <span class="text-sm font-medium">{{ item.month }}</span>
                                        <span class="text-sm text-muted">{{ item.users }}</span>
                                    </div>
                                    <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                        <div 
                                            class="bg-primary-500 h-2 rounded-full transition-all duration-300"
                                            :style="{ width: `${(item.users / Math.max(...userGrowthData.map(d => d.users))) * 100}%` }"
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div v-else class="text-center text-muted py-8">
                            No hay datos disponibles
                        </div>
                    </UPageCard>

                    <!-- Subscription Distribution -->
                    <UPageCard
                        title="Distribución de Suscripciones"
                        :ui="{
                            title: 'font-semibold text-base',
                            body: { padding: 'p-4 sm:p-6' }
                        }"
                    >
                        <div v-if="subscriptionChartData.length > 0" class="space-y-4">
                            <div v-for="(item, index) in subscriptionChartData" :key="item.name" class="flex items-center gap-4">
                                <div class="flex-1">
                                    <div class="flex justify-between items-center mb-1">
                                        <div class="flex items-center gap-2">
                                            <div 
                                                class="w-3 h-3 rounded-full"
                                                :class="[
                                                    index === 0 ? 'bg-blue-500' : '',
                                                    index === 1 ? 'bg-green-500' : '',
                                                    index === 2 ? 'bg-purple-500' : '',
                                                    index >= 3 ? 'bg-orange-500' : ''
                                                ]"
                                            ></div>
                                            <span class="text-sm font-medium">{{ item.name }}</span>
                                        </div>
                                        <span class="text-sm text-muted">{{ item.users }} usuarios</span>
                                    </div>
                                    <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                        <div 
                                            class="h-2 rounded-full transition-all duration-300"
                                            :class="[
                                                index === 0 ? 'bg-blue-500' : '',
                                                index === 1 ? 'bg-green-500' : '',
                                                index === 2 ? 'bg-purple-500' : '',
                                                index >= 3 ? 'bg-orange-500' : ''
                                            ]"
                                            :style="{ width: `${stats?.stats.totalUsers ? (item.users / stats.stats.totalUsers) * 100 : 0}%` }"
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div v-else class="text-center text-muted py-8">
                            No hay suscripciones disponibles
                        </div>
                    </UPageCard>
                </UPageGrid>

                <!-- Services Overview -->
                <UPageCard
                    title="Servicios Activos"
                    :ui="{
                        title: 'font-semibold text-base',
                        body: { padding: 'p-4 sm:p-6' }
                    }"
                >
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div class="flex items-center gap-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                            <div class="p-3 rounded-full bg-primary-100 dark:bg-primary-900/30">
                                <UIcon name="i-lucide-cpu" class="w-6 h-6 text-primary-600 dark:text-primary-400" />
                            </div>
                            <div>
                                <p class="text-2xl font-semibold">{{ stats?.stats.totalServices || 0 }}</p>
                                <p class="text-xs text-muted">Total servicios</p>
                            </div>
                        </div>
                        
                        <div class="flex items-center gap-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                            <div class="p-3 rounded-full bg-green-100 dark:bg-green-900/30">
                                <UIcon name="i-lucide-check-circle" class="w-6 h-6 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                                <p class="text-2xl font-semibold">{{ stats?.stats.activeServices || 0 }}</p>
                                <p class="text-xs text-muted">Servicios activos</p>
                            </div>
                        </div>
                        
                        <div class="flex items-center gap-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                            <div class="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30">
                                <UIcon name="i-lucide-credit-card" class="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <p class="text-2xl font-semibold">{{ stats?.stats.totalSubscriptions || 0 }}</p>
                                <p class="text-xs text-muted">Planes disponibles</p>
                            </div>
                        </div>
                    </div>
                </UPageCard>
            </div>
        </template>
    </UDashboardPanel>
</template>
