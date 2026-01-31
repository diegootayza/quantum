<script setup lang="ts">
    definePageMeta({ layout: 'dashboard', middleware: ['auth', 'admin'] })

    useSeoMeta({
        description: 'Panel de administración del sistema',
        title: 'Panel de Control',
    })

    const { data, pending } = await useFetch('/api/dashboard/home')

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
        ]
    })

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
                            </div>
                        </UPageCard>
                    </UPageGrid>
                </ClientOnly>
            </div>
            <ClientOnly>
                <ChartDonut :data="data?.usageByModel || []" />
            </ClientOnly>
        </template>
    </UDashboardPanel>
</template>
