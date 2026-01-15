<script setup lang="ts">
    definePageMeta({ layout: 'dashboard', middleware: 'auth' })

    const { user } = useUserSession()
    const { data: stats, pending } = await useFetch('/api/user/stats')

    const statisticsCards = computed(() => [
        {
            bgClass: 'bg-blue-100 dark:bg-blue-900/30',
            icon: 'i-lucide-message-square',
            iconClass: 'text-blue-600 dark:text-blue-400',
            key: 'conversations',
            subtitle: `${stats.value?.stats.conversationsThisMonth || 0} este mes`,
            title: 'Conversaciones',
            value: stats.value?.stats.totalConversations || 0,
        },
        {
            bgClass: 'bg-green-100 dark:bg-green-900/30',
            icon: 'i-lucide-send',
            iconClass: 'text-green-600 dark:text-green-400',
            key: 'messages',
            subtitle: 'Total enviados',
            title: 'Mensajes',
            value: stats.value?.stats.totalMessages || 0,
        },
        {
            bgClass: 'bg-purple-100 dark:bg-purple-900/30',
            icon: 'i-lucide-file',
            iconClass: 'text-purple-600 dark:text-purple-400',
            key: 'files',
            subtitle: `${stats.value?.stats.storageUsed || 0} MB usados`,
            title: 'Archivos',
            value: stats.value?.stats.totalFiles || 0,
        },
        {
            bgClass: 'bg-orange-100 dark:bg-orange-900/30',
            icon: 'i-lucide-calendar',
            iconClass: 'text-orange-600 dark:text-orange-400',
            key: 'account',
            subtitle: 'días activo',
            title: 'Cuenta',
            value: stats.value?.stats.accountAge || 0,
        },
    ])

    const quickActions = computed(() => [
        {
            description: 'Iniciar un nuevo chat',
            icon: 'i-lucide-plus-circle',
            show: user.value?.active,
            title: 'Nueva Conversación',
            to: '/conversation',
        },
        {
            description: 'Cambiar contraseña',
            icon: 'i-lucide-shield',
            show: true,
            title: 'Seguridad',
            to: '/profile/security',
        },
    ])
</script>

<template>
    <UDashboardPanel
        id="profile-home"
        :ui="{ body: 'lg:py-12' }"
    >
        <template #header>
            <UDashboardNavbar>
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
                class="flex flex-col gap-6 w-full max-w-6xl mx-auto px-4"
            >
                <!-- Welcome Section -->
                <div class="text-center space-y-2 py-8">
                    <h1 class="text-4xl font-bold text-gray-900 dark:text-white">Hola, {{ user?.name }} {{ user?.surname }}</h1>
                    <p class="text-lg text-gray-500 dark:text-gray-400">Bienvenido a tu panel de control</p>
                </div>

                <!-- Subscription Info -->
                <UPageCard
                    v-if="stats?.subscription"
                    title="Tu Plan"
                    :ui="{
                        title: 'font-semibold text-base',
                        body: 'p-4 sm:p-6',
                    }"
                >
                    <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div class="space-y-1">
                            <div class="flex items-center gap-2">
                                <UIcon
                                    class="w-5 h-5 text-primary-500"
                                    name="i-lucide-crown"
                                />
                                <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                                    {{ stats.subscription.name }}
                                </h3>
                            </div>
                            <p class="text-sm text-gray-500 dark:text-gray-400">{{ stats.subscription.price }} {{ stats.subscription.currency }} / {{ stats.subscription.interval }}</p>
                        </div>

                        <div
                            v-if="stats.subscription.services && stats.subscription.services.length > 0"
                            class="space-y-2"
                        >
                            <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Servicios incluidos:</p>
                            <div class="flex flex-wrap gap-2">
                                <span
                                    v-for="service in stats.subscription.services"
                                    :key="service.id"
                                    class="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400"
                                >
                                    <UIcon
                                        class="w-3 h-3"
                                        name="i-lucide-check"
                                    />
                                    {{ service.name }}
                                </span>
                            </div>
                        </div>
                    </div>
                </UPageCard>

                <!-- Statistics Grid -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <UPageCard
                        v-for="card in statisticsCards"
                        :key="card.key"
                        :ui="{
                            body: 'p-4 sm:p-6',
                        }"
                    >
                        <div class="flex items-start justify-between">
                            <div class="space-y-1">
                                <p class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ card.title }}</p>
                                <p class="text-2xl font-bold text-gray-900 dark:text-white">
                                    {{ card.value }}
                                </p>
                                <p class="text-xs text-gray-500 dark:text-gray-400">{{ card.subtitle }}</p>
                            </div>
                            <div
                                class="rounded-full shrink-0 size-8 flex items-center justify-center"
                                :class="card.bgClass"
                            >
                                <UIcon
                                    class="size-4"
                                    :class="card.iconClass"
                                    :name="card.icon"
                                />
                            </div>
                        </div>
                    </UPageCard>
                </div>
                <UPageCard
                    v-if="stats?.services && stats.services.length > 0"
                    title="Servicios Adicionales"
                    :ui="{
                        title: 'font-semibold text-base',
                        body: 'p-4 sm:p-6',
                    }"
                >
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div
                            v-for="service in stats.services"
                            :key="service.id"
                            class="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50"
                        >
                            <div class="rounded-full bg-primary-100 dark:bg-primary-900/30">
                                <UIcon
                                    class="size-4 text-primary-600 dark:text-primary-400"
                                    name="i-lucide-zap"
                                />
                            </div>
                            <div>
                                <p class="font-medium text-sm text-gray-900 dark:text-white">
                                    {{ service.name }}
                                </p>
                                <p class="text-xs text-gray-500 dark:text-gray-400">
                                    {{ service.description }}
                                </p>
                            </div>
                        </div>
                    </div>
                </UPageCard>
                <UPageCard
                    title="Acciones Rápidas"
                    :ui="{
                        title: 'font-semibold text-base',
                        body: 'p-4 sm:p-6',
                    }"
                >
                    <div class="flex flex-col md:flex-row gap-4">
                        <NuxtLink
                            v-for="action in quickActions"
                            v-show="action.show"
                            :key="action.to"
                            class="group flex-1"
                            :to="action.to"
                        >
                            <div class="flex items-center gap-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-500 transition-colors cursor-pointer">
                                <UIcon
                                    class="w-6 h-6 text-primary-500"
                                    :name="action.icon"
                                />
                                <div>
                                    <p class="font-medium text-sm text-gray-900 dark:text-white">{{ action.title }}</p>
                                    <p class="text-xs text-gray-500 dark:text-gray-400">{{ action.description }}</p>
                                </div>
                            </div>
                        </NuxtLink>
                    </div>
                </UPageCard>
            </div>
        </template>
    </UDashboardPanel>
</template>
