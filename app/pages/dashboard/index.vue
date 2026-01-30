<script setup lang="ts">
    definePageMeta({ layout: 'dashboard', middleware: ['auth', 'admin'] })

    useSeoMeta({
        description: 'Panel de administración del sistema',
        title: 'Panel de Control',
    })

    const { data: stats, pending } = await useFetch('/api/dashboard/stats')

    const store = useUsersStore()
    const { users } = storeToRefs(store)
    const socket = useSocket()

    const totalUsers = ref(0)

    const statsCards = computed(() => {
        const devices = Object.values(users.value).reduce((acc, deviceList) => acc + deviceList.length, 0)

        return [
            {
                subtitle: `${devices} ${devices === 1 ? 'dispositivo' : 'dispositivos'}`,
                title: 'Usuarios Conectados',
                value: totalUsers,
            },
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
    })

    onMounted(() => {
        socket?.emit('admin:stats', (v: any) => {
            totalUsers.value = v.total || 0
        })

        socket?.on('admin:stats.update', (v: any) => {
            totalUsers.value = v.total || 0
        })
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
                <ClientOnly>
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
                </ClientOnly>
            </div>
        </template>
    </UDashboardPanel>
</template>
