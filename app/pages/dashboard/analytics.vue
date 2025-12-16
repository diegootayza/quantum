<script setup lang="ts">
    definePageMeta({ layout: 'dashboard', middleware: 'auth' })

    const period = ref(30)

    const { data: businessMetrics, pending: loadingBusiness } = await useFetch('/api/dashboard/analytics/business-metrics')

    const {
        data: growthData,
        pending: loadingGrowth,
        refresh,
    } = await useFetch('/api/dashboard/analytics/growth-metrics', {
        query: { days: period },
    })

    const { data: eventsData, pending: loadingEvents } = await useFetch('/api/dashboard/analytics/events', {
        query: { days: period },
    })

    const {
        data: chartData,
        pending: loadingCharts,
        refresh: refreshCharts,
    } = await useFetch('/api/dashboard/analytics/chart-data', {
        query: { days: period },
    })

    // Cambiar período
    async function changePeriod(days: number) {
        period.value = days
        await Promise.all([refresh(), refreshCharts()])
    }

    // Formatear moneda
    function formatCurrency(num: number) {
        return new Intl.NumberFormat('es-ES', {
            currency: 'USD',
            style: 'currency',
        }).format(num)
    }

    // Formatear números con separadores de miles
    function formatNumber(num: number) {
        return new Intl.NumberFormat('es-ES').format(num)
    }

    // Formatear porcentaje
    function formatPercentage(num: number) {
        return `${num.toFixed(2)}%`
    }

    // Preparar datos para gráfico de nuevos usuarios
    const newUsersChartData = computed(() => {
        if (!chartData.value?.newUsersByDay) return null

        return {
            datasets: [
                {
                    backgroundColor: 'rgba(99, 102, 241, 0.5)',
                    borderColor: 'rgb(99, 102, 241)',
                    borderRadius: 4,
                    data: chartData.value.newUsersByDay.map((d: any) => d.count),
                    label: 'Nuevos Usuarios',
                },
            ],
            labels: chartData.value.newUsersByDay.map((d: any) => new Date(d.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })),
        }
    })

    // Preparar datos para gráfico de eventos
    const eventsChartData = computed(() => {
        if (!chartData.value?.eventsByDay) return null

        const eventTypes = Object.keys(chartData.value.eventsByDay)
        const colors = ['rgb(99, 102, 241)', 'rgb(16, 185, 129)', 'rgb(245, 158, 11)', 'rgb(239, 68, 68)']

        const datasets = eventTypes.map((eventType, index) => ({
            backgroundColor: colors[index % colors.length].replace('rgb', 'rgba').replace(')', ', 0.2)'),
            borderColor: colors[index % colors.length],
            data: chartData.value.eventsByDay[eventType].map((d: any) => d.count),
            fill: true,
            label: eventType.replace(/_/g, ' '),
            tension: 0.4,
        }))

        const labels = chartData.value.eventsByDay[eventTypes[0]]?.map((d: any) => new Date(d.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }))

        return {
            datasets,
            labels,
        }
    })

    // Preparar datos para gráfico de distribución de suscripciones
    const subscriptionDistributionData = computed(() => {
        if (!chartData.value?.subscriptionDistribution) return null

        const colors = ['rgb(99, 102, 241)', 'rgb(16, 185, 129)', 'rgb(245, 158, 11)', 'rgb(239, 68, 68)', 'rgb(139, 92, 246)']

        return {
            datasets: [
                {
                    backgroundColor: colors,
                    borderWidth: 2,
                    data: chartData.value.subscriptionDistribution.map((d: any) => d.count),
                },
            ],
            labels: chartData.value.subscriptionDistribution.map((d: any) => d.name),
        }
    })
</script>

<template>
    <UDashboardPanel
        id="analytics-dashboard"
        :ui="{ body: 'lg:py-12' }"
    >
        <template #header>
            <UDashboardNavbar title="Analytics">
                <template #leading>
                    <UDashboardSidebarCollapse />
                </template>
                <template #trailing>
                    <UButtonGroup>
                        <UButton
                            size="sm"
                            :variant="period === 7 ? 'solid' : 'ghost'"
                            @click="changePeriod(7)"
                        >
                            7 días
                        </UButton>
                        <UButton
                            size="sm"
                            :variant="period === 30 ? 'solid' : 'ghost'"
                            @click="changePeriod(30)"
                        >
                            30 días
                        </UButton>
                        <UButton
                            size="sm"
                            :variant="period === 90 ? 'solid' : 'ghost'"
                            @click="changePeriod(90)"
                        >
                            90 días
                        </UButton>
                    </UButtonGroup>
                </template>
            </UDashboardNavbar>
        </template>

        <template #body>
            <div class="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4">
                <!-- Business Metrics -->
                <div>
                    <h2 class="mb-4 text-2xl font-bold text-gray-900 dark:text-white">Métricas de Negocio</h2>

                    <div
                        v-if="loadingBusiness"
                        class="flex justify-center py-12"
                    >
                        <UIcon
                            class="h-8 w-8 animate-spin"
                            name="i-lucide-loader-2"
                        />
                    </div>

                    <div
                        v-else
                        class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5"
                    >
                        <UCard>
                            <div class="space-y-2">
                                <p class="text-sm font-medium text-gray-500 dark:text-gray-400">MRR</p>
                                <p class="text-3xl font-bold text-gray-900 dark:text-white">
                                    {{ formatCurrency(businessMetrics?.mrr || 0) }}
                                </p>
                                <p class="text-xs text-gray-500 dark:text-gray-400">Monthly Recurring Revenue</p>
                            </div>
                        </UCard>

                        <UCard>
                            <div class="space-y-2">
                                <p class="text-sm font-medium text-gray-500 dark:text-gray-400">ARR</p>
                                <p class="text-3xl font-bold text-gray-900 dark:text-white">
                                    {{ formatCurrency(businessMetrics?.arr || 0) }}
                                </p>
                                <p class="text-xs text-gray-500 dark:text-gray-400">Annual Recurring Revenue</p>
                            </div>
                        </UCard>

                        <UCard>
                            <div class="space-y-2">
                                <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Churn Rate</p>
                                <p class="text-3xl font-bold text-red-600 dark:text-red-400">
                                    {{ formatPercentage(businessMetrics?.churnRate || 0) }}
                                </p>
                                <p class="text-xs text-gray-500 dark:text-gray-400">Últimos 30 días</p>
                            </div>
                        </UCard>

                        <UCard>
                            <div class="space-y-2">
                                <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Conversión</p>
                                <p class="text-3xl font-bold text-green-600 dark:text-green-400">
                                    {{ formatPercentage(businessMetrics?.conversionRate || 0) }}
                                </p>
                                <p class="text-xs text-gray-500 dark:text-gray-400">Trial a Pago</p>
                            </div>
                        </UCard>

                        <UCard>
                            <div class="space-y-2">
                                <p class="text-sm font-medium text-gray-500 dark:text-gray-400">LTV</p>
                                <p class="text-3xl font-bold text-gray-900 dark:text-white">
                                    {{ formatCurrency(businessMetrics?.ltv || 0) }}
                                </p>
                                <p class="text-xs text-gray-500 dark:text-gray-400">Lifetime Value</p>
                            </div>
                        </UCard>
                    </div>
                </div>

                <!-- Growth Metrics -->
                <div>
                    <h2 class="mb-4 text-2xl font-bold text-gray-900 dark:text-white">Crecimiento</h2>

                    <div
                        v-if="loadingGrowth"
                        class="flex justify-center py-12"
                    >
                        <UIcon
                            class="h-8 w-8 animate-spin"
                            name="i-lucide-loader-2"
                        />
                    </div>

                    <div
                        v-else
                        class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4"
                    >
                        <UCard>
                            <div class="space-y-2">
                                <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Total Usuarios</p>
                                <p class="text-3xl font-bold text-gray-900 dark:text-white">
                                    {{ formatNumber(growthData?.growthMetrics.totalUsers || 0) }}
                                </p>
                            </div>
                        </UCard>

                        <UCard>
                            <div class="space-y-2">
                                <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Usuarios Activos</p>
                                <p class="text-3xl font-bold text-gray-900 dark:text-white">
                                    {{ formatNumber(growthData?.growthMetrics.activeUsers || 0) }}
                                </p>
                            </div>
                        </UCard>

                        <UCard>
                            <div class="space-y-2">
                                <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Nuevos Usuarios</p>
                                <p class="text-3xl font-bold text-gray-900 dark:text-white">
                                    {{ formatNumber(growthData?.growthMetrics.newUsers || 0) }}
                                </p>
                                <p class="text-xs text-gray-500 dark:text-gray-400">Últimos {{ period }} días</p>
                            </div>
                        </UCard>

                        <UCard>
                            <div class="space-y-2">
                                <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Crecimiento</p>
                                <p
                                    class="text-3xl font-bold"
                                    :class="(growthData?.growthMetrics.newUsersGrowth || 0) >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'"
                                >
                                    {{ formatPercentage(growthData?.growthMetrics.newUsersGrowth || 0) }}
                                </p>
                                <p class="text-xs text-gray-500 dark:text-gray-400">vs período anterior</p>
                            </div>
                        </UCard>
                    </div>
                </div>

                <!-- Charts Section -->
                <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <!-- Nuevos Usuarios Chart -->
                    <UCard>
                        <template #header>
                            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Nuevos Usuarios</h3>
                        </template>

                        <div
                            v-if="loadingCharts"
                            class="flex justify-center py-12"
                        >
                            <UIcon
                                class="h-8 w-8 animate-spin"
                                name="i-lucide-loader-2"
                            />
                        </div>

                        <BarChart
                            v-else-if="newUsersChartData"
                            :data="newUsersChartData"
                            :height="300"
                        />

                        <div
                            v-else
                            class="py-12 text-center text-gray-500 dark:text-gray-400"
                        >
                            No hay datos disponibles
                        </div>
                    </UCard>

                    <!-- Distribución de Suscripciones Chart -->
                    <UCard>
                        <template #header>
                            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Distribución de Suscripciones</h3>
                        </template>

                        <div
                            v-if="loadingCharts"
                            class="flex justify-center py-12"
                        >
                            <UIcon
                                class="h-8 w-8 animate-spin"
                                name="i-lucide-loader-2"
                            />
                        </div>

                        <DoughnutChart
                            v-else-if="subscriptionDistributionData"
                            :data="subscriptionDistributionData"
                            :height="300"
                        />

                        <div
                            v-else
                            class="py-12 text-center text-gray-500 dark:text-gray-400"
                        >
                            No hay datos disponibles
                        </div>
                    </UCard>
                </div>

                <!-- Eventos por Día Chart -->
                <UCard>
                    <template #header>
                        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Actividad de Eventos</h3>
                    </template>

                    <div
                        v-if="loadingCharts"
                        class="flex justify-center py-12"
                    >
                        <UIcon
                            class="h-8 w-8 animate-spin"
                            name="i-lucide-loader-2"
                        />
                    </div>

                    <LineChart
                        v-else-if="eventsChartData"
                        :data="eventsChartData"
                        :height="350"
                    />

                    <div
                        v-else
                        class="py-12 text-center text-gray-500 dark:text-gray-400"
                    >
                        No hay datos disponibles
                    </div>
                </UCard>

                <!-- Subscription Metrics -->
                <div>
                    <h2 class="mb-4 text-2xl font-bold text-gray-900 dark:text-white">Suscripciones</h2>

                    <div
                        v-if="loadingGrowth"
                        class="flex justify-center py-12"
                    >
                        <UIcon
                            class="h-8 w-8 animate-spin"
                            name="i-lucide-loader-2"
                        />
                    </div>

                    <div
                        v-else
                        class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4"
                    >
                        <UCard>
                            <div class="space-y-2">
                                <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Suscripciones Activas</p>
                                <p class="text-3xl font-bold text-gray-900 dark:text-white">
                                    {{ formatNumber(growthData?.subscriptionMetrics.activeSubscriptions || 0) }}
                                </p>
                            </div>
                        </UCard>

                        <UCard>
                            <div class="space-y-2">
                                <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Nuevas Suscripciones</p>
                                <p class="text-3xl font-bold text-green-600 dark:text-green-400">
                                    {{ formatNumber(growthData?.subscriptionMetrics.newSubscriptions || 0) }}
                                </p>
                                <p class="text-xs text-gray-500 dark:text-gray-400">Últimos {{ period }} días</p>
                            </div>
                        </UCard>

                        <UCard>
                            <div class="space-y-2">
                                <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Cancelaciones</p>
                                <p class="text-3xl font-bold text-red-600 dark:text-red-400">
                                    {{ formatNumber(growthData?.subscriptionMetrics.cancelledSubscriptions || 0) }}
                                </p>
                                <p class="text-xs text-gray-500 dark:text-gray-400">Últimos {{ period }} días</p>
                            </div>
                        </UCard>

                        <UCard>
                            <div class="space-y-2">
                                <p class="text-sm font-medium text-gray-500 dark:text-gray-400">ARPU</p>
                                <p class="text-3xl font-bold text-gray-900 dark:text-white">
                                    {{ formatCurrency(growthData?.subscriptionMetrics.averageRevenuePerUser || 0) }}
                                </p>
                                <p class="text-xs text-gray-500 dark:text-gray-400">Average Revenue Per User</p>
                            </div>
                        </UCard>
                    </div>
                </div>

                <!-- Product Metrics -->
                <div>
                    <h2 class="mb-4 text-2xl font-bold text-gray-900 dark:text-white">Uso del Producto</h2>

                    <div
                        v-if="loadingGrowth"
                        class="flex justify-center py-12"
                    >
                        <UIcon
                            class="h-8 w-8 animate-spin"
                            name="i-lucide-loader-2"
                        />
                    </div>

                    <div
                        v-else
                        class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4"
                    >
                        <UCard>
                            <div class="space-y-2">
                                <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Conversaciones</p>
                                <p class="text-3xl font-bold text-gray-900 dark:text-white">
                                    {{ formatNumber(growthData?.productMetrics.conversationsThisPeriod || 0) }}
                                </p>
                                <p class="text-xs text-gray-500 dark:text-gray-400">Últimos {{ period }} días</p>
                            </div>
                        </UCard>

                        <UCard>
                            <div class="space-y-2">
                                <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Mensajes</p>
                                <p class="text-3xl font-bold text-gray-900 dark:text-white">
                                    {{ formatNumber(growthData?.productMetrics.messagesThisPeriod || 0) }}
                                </p>
                                <p class="text-xs text-gray-500 dark:text-gray-400">Últimos {{ period }} días</p>
                            </div>
                        </UCard>

                        <UCard>
                            <div class="space-y-2">
                                <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Imágenes Generadas</p>
                                <p class="text-3xl font-bold text-gray-900 dark:text-white">
                                    {{ formatNumber(growthData?.productMetrics.imagesThisPeriod || 0) }}
                                </p>
                                <p class="text-xs text-gray-500 dark:text-gray-400">Últimos {{ period }} días</p>
                            </div>
                        </UCard>

                        <UCard>
                            <div class="space-y-2">
                                <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Total Imágenes</p>
                                <p class="text-3xl font-bold text-gray-900 dark:text-white">
                                    {{ formatNumber(growthData?.productMetrics.totalImagesGenerated || 0) }}
                                </p>
                                <p class="text-xs text-gray-500 dark:text-gray-400">Histórico</p>
                            </div>
                        </UCard>
                    </div>
                </div>

                <!-- Events Summary -->
                <div>
                    <h2 class="mb-4 text-2xl font-bold text-gray-900 dark:text-white">Eventos (Últimos {{ period }} días)</h2>

                    <div
                        v-if="loadingEvents"
                        class="flex justify-center py-12"
                    >
                        <UIcon
                            class="h-8 w-8 animate-spin"
                            name="i-lucide-loader-2"
                        />
                    </div>

                    <UCard v-else>
                        <div class="grid grid-cols-2 gap-4 md:grid-cols-4">
                            <div
                                v-for="event in eventsData?.eventCounts"
                                :key="event.type"
                                class="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50"
                            >
                                <p class="mb-1 text-xs font-medium text-gray-500 dark:text-gray-400">
                                    {{ event.type.replace(/_/g, ' ') }}
                                </p>
                                <p class="text-2xl font-bold text-gray-900 dark:text-white">
                                    {{ formatNumber(event.count) }}
                                </p>
                            </div>
                        </div>
                    </UCard>
                </div>
            </div>
        </template>
    </UDashboardPanel>
</template>
