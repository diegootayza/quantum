<script setup lang="ts">
    definePageMeta({ layout: 'dashboard', middleware: ['auth', 'admin'] })

    useSeoMeta({
        description: 'Panel de administración del sistema',
        title: 'Panel de Control',
    })

    const axios = useAxios()

    const { data, pending } = await useAsyncData('dashboard-home', () => axiosData(axios.get<API.DashboardHomeResponse>('/api/dashboard/home')), { default: () => ({}) as API.DashboardHomeResponse })

    const socket = useSocket()

    const totalOnlineUsers = ref(0)

    const statsCards = computed(() => {
        return [
            {
                title: 'Usuarios',
                value: data.value?.totalUsers || 0,
            },
            {
                title: 'Usuarios Conectados',
                value: totalOnlineUsers.value,
            },
            {
                title: 'Chats',
                value: data.value?.totalChats || 0,
            },
            {
                title: 'Mensajes',
                value: data.value?.totalMessages || 0,
            },
            {
                title: 'Tamaño de Archivos',
                value: formatFileSize(data.value?.sizeFiles || 0),
            },
        ]
    })

    function buildChartData(rows: Array<{ day: string; model: string; tokens: number }>) {
        const labels = getLastDays(7)

        const models = [...new Set(rows.map((r) => r.model))]

        const map = new Map()

        rows.forEach((r) => {
            map.set(`${r.model}-${r.day}`, r.tokens)
        })

        const datasets = models.map((model) => ({
            data: labels.map((day) => map.get(`${model}-${day}`) ?? 0),
            label: model,
            tension: 0.35,
        }))

        return { datasets, labels }
    }

    onMounted(() => {
        socket?.emit('admin:stats', (v: any) => {
            totalOnlineUsers.value = v.total || 0
        })

        socket?.on('admin:stats.update', (v: any) => {
            totalOnlineUsers.value = v.total || 0
        })
    })
</script>

<template>
    <UDashboardPanel id="dashboard-home">
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
                        </div>
                    </UPageCard>
                </UPageGrid>
            </div>
            <UPageCard title="Uso de tokens por modelo (últimos 7 días)">
                <ChartBar :dataChart="buildChartData(data?.usageByModel || [])" />
            </UPageCard>

            <!-- <ClientOnly>
                <ChartDonut :data="data?.usageByModel || []" />
            </ClientOnly> -->
        </template>
    </UDashboardPanel>
</template>
