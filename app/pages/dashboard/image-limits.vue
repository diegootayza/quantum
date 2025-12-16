<script setup lang="ts">
    definePageMeta({ layout: 'dashboard', middleware: 'auth' })

    const { data: stats, pending, refresh } = await useFetch('/api/dashboard/image-stats')
    const { data: subscriptions } = await useFetch('/api/dashboard/subscription')

    const toast = useToast()

    // Estado para edición de límites
    const editingLimit = ref<{ id: string; limit: number } | null>(null)
    const tempLimit = ref(0)
    const isUpdating = ref(false)

    // Computed para controlar el modal
    const isModalOpen = computed({
        get: () => editingLimit.value !== null,
        set: (value) => {
            if (!value) editingLimit.value = null
        },
    })

    // Color de la barra de progreso
    function getProgressColor(percentage: number) {
        if (percentage >= 100) return 'bg-red-500'
        if (percentage >= 80) return 'bg-orange-500'
        return 'bg-primary-500'
    }

    // Calcular porcentaje de uso
    function getUsagePercentage(used: number, limit: number) {
        if (limit === 0) return 0
        return Math.min(100, (used / limit) * 100)
    }

    // Función para abrir modal de edición
    function openEditModal(subscriptionName: string, currentLimit: number) {
        editingLimit.value = { id: subscriptionName, limit: currentLimit }
        tempLimit.value = currentLimit
    }

    // Función para resetear contador de usuario
    async function resetUserCount(userId: string) {
        try {
            await $fetch(`/api/dashboard/user/${userId}/reset-image-count`, {
                method: 'POST',
            })

            toast.add({
                color: 'success',
                description: 'Contador reseteado exitosamente',
                title: 'Éxito',
            })

            await refresh()
        } catch (error: any) {
            toast.add({
                color: 'error',
                description: error.message || 'Error al resetear contador',
                title: 'Error',
            })
        }
    }

    // Función para actualizar límite
    async function updateLimit(subscriptionId: string) {
        isUpdating.value = true
        try {
            await $fetch(`/api/dashboard/subscription/${subscriptionId}/image-limit`, {
                body: { imageGenerationLimit: tempLimit.value },
                method: 'PATCH',
            })

            toast.add({
                color: 'success',
                description: 'Límite actualizado exitosamente',
                title: 'Éxito',
            })

            editingLimit.value = null
            await refresh()
        } catch (error: any) {
            toast.add({
                color: 'error',
                description: error.message || 'Error al actualizar el límite',
                title: 'Error',
            })
        } finally {
            isUpdating.value = false
        }
    }
</script>

<template>
    <UDashboardPanel
        id="image-limits-dashboard"
        :ui="{ body: 'lg:py-12' }"
    >
        <template #header>
            <UDashboardNavbar title="Gestión de Límites de Imágenes">
                <template #leading>
                    <UDashboardSidebarCollapse />
                </template>
            </UDashboardNavbar>
        </template>

        <template #body>
            <div
                v-if="pending"
                class="flex h-64 items-center justify-center"
            >
                <UIcon
                    class="h-10 w-10 animate-spin text-primary-500"
                    name="i-lucide-loader-2"
                />
            </div>

            <div
                v-else
                class="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4"
            >
                <!-- Header -->
                <div class="space-y-2">
                    <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Gestión de Límites de Imágenes</h1>
                    <p class="text-gray-500 dark:text-gray-400">Administra los límites de generación de imágenes por suscripción y monitorea el uso</p>
                </div>

                <!-- Overview Stats -->
                <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
                    <UPageCard :ui="{ body: { padding: 'p-4' } }">
                        <div class="space-y-1">
                            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Total Generadas</p>
                            <p class="text-2xl font-bold text-gray-900 dark:text-white">
                                {{ stats?.overview.totalImagesGenerated || 0 }}
                            </p>
                            <p class="text-xs text-gray-500 dark:text-gray-400">Todas las imágenes</p>
                        </div>
                    </UPageCard>

                    <UPageCard :ui="{ body: { padding: 'p-4' } }">
                        <div class="space-y-1">
                            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Este Mes</p>
                            <p class="text-2xl font-bold text-gray-900 dark:text-white">
                                {{ stats?.overview.imagesThisMonth || 0 }}
                            </p>
                            <p class="text-xs text-gray-500 dark:text-gray-400">Imágenes generadas</p>
                        </div>
                    </UPageCard>

                    <UPageCard :ui="{ body: { padding: 'p-4' } }">
                        <div class="space-y-1">
                            <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Usuarios con Límites</p>
                            <p class="text-2xl font-bold text-gray-900 dark:text-white">
                                {{ stats?.overview.usersWithLimits || 0 }}
                            </p>
                            <p class="text-xs text-gray-500 dark:text-gray-400">Con suscripción</p>
                        </div>
                    </UPageCard>

                    <UPageCard :ui="{ body: { padding: 'p-4' } }">
                        <div class="space-y-1">
                            <p class="text-sm font-medium text-orange-500 dark:text-orange-400">Cerca del Límite</p>
                            <p class="text-2xl font-bold text-orange-600 dark:text-orange-400">
                                {{ stats?.overview.nearLimit || 0 }}
                            </p>
                            <p class="text-xs text-gray-500 dark:text-gray-400">>80% usado</p>
                        </div>
                    </UPageCard>

                    <UPageCard :ui="{ body: { padding: 'p-4' } }">
                        <div class="space-y-1">
                            <p class="text-sm font-medium text-red-500 dark:text-red-400">En el Límite</p>
                            <p class="text-2xl font-bold text-red-600 dark:text-red-400">
                                {{ stats?.overview.atLimit || 0 }}
                            </p>
                            <p class="text-xs text-gray-500 dark:text-gray-400">100% usado</p>
                        </div>
                    </UPageCard>
                </div>

                <!-- Subscription Limits Management -->
                <UPageCard
                    title="Límites por Suscripción"
                    :ui="{
                        title: 'text-lg font-semibold',
                        body: { padding: 'p-6' },
                    }"
                >
                    <div class="space-y-4">
                        <div
                            v-for="sub in stats?.subscriptionStats"
                            :key="sub.name"
                            class="rounded-lg border border-gray-200 p-4 dark:border-gray-700"
                        >
                            <div class="mb-3 flex items-center justify-between">
                                <div>
                                    <h3 class="font-semibold text-gray-900 dark:text-white">
                                        {{ sub.name }}
                                    </h3>
                                    <p class="text-sm text-gray-500 dark:text-gray-400">{{ sub.userCount }} usuario(s)</p>
                                </div>
                                <div class="text-right">
                                    <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Límite actual</p>
                                    <p class="text-xl font-bold text-gray-900 dark:text-white">
                                        {{ sub.limit === -1 ? 'Ilimitado' : sub.limit }}
                                    </p>
                                </div>
                            </div>

                            <div class="mb-3 grid grid-cols-2 gap-4">
                                <div>
                                    <p class="text-xs text-gray-500 dark:text-gray-400">Uso Total</p>
                                    <p class="text-lg font-semibold text-gray-900 dark:text-white">
                                        {{ sub.totalUsage }}
                                    </p>
                                </div>
                                <div>
                                    <p class="text-xs text-gray-500 dark:text-gray-400">Promedio por Usuario</p>
                                    <p class="text-lg font-semibold text-gray-900 dark:text-white">
                                        {{ sub.avgUsage }}
                                    </p>
                                </div>
                            </div>

                            <UButton
                                size="sm"
                                variant="outline"
                                @click="openEditModal(sub.name, sub.limit)"
                            >
                                <UIcon
                                    class="mr-1 h-4 w-4"
                                    name="i-lucide-edit"
                                />
                                Editar Límite
                            </UButton>
                        </div>
                    </div>
                </UPageCard>

                <!-- Top Users -->
                <UPageCard
                    title="Top Usuarios por Uso"
                    :ui="{
                        title: 'text-lg font-semibold',
                        body: { padding: 'p-6' },
                    }"
                >
                    <div class="space-y-3">
                        <div
                            v-for="(user, index) in stats?.topUsers"
                            :key="user.id"
                            class="flex items-center gap-4 rounded-lg bg-gray-50 p-3 dark:bg-gray-800/50"
                        >
                            <div class="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/30">
                                <span class="text-sm font-bold text-primary-600 dark:text-primary-400">
                                    {{ index + 1 }}
                                </span>
                            </div>

                            <div class="min-w-0 flex-1">
                                <p class="truncate text-sm font-medium text-gray-900 dark:text-white">
                                    {{ user.name }}
                                </p>
                                <p class="truncate text-xs text-gray-500 dark:text-gray-400">
                                    {{ user.email }}
                                </p>
                            </div>

                            <div class="flex-shrink-0 text-right">
                                <p class="text-sm font-semibold text-gray-900 dark:text-white">{{ user.used }} / {{ user.limit }}</p>
                                <p class="text-xs text-gray-500 dark:text-gray-400">
                                    {{ user.subscription }}
                                </p>
                            </div>

                            <div class="w-24 flex-shrink-0">
                                <div class="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                                    <div
                                        class="h-2 rounded-full transition-all"
                                        :class="getProgressColor(getUsagePercentage(user.used, user.limit))"
                                        :style="{ width: `${getUsagePercentage(user.used, user.limit)}%` }"
                                    />
                                </div>
                            </div>

                            <UButton
                                color="error"
                                size="xs"
                                variant="ghost"
                                @click="resetUserCount(user.id)"
                            >
                                <UIcon
                                    class="h-3 w-3"
                                    name="i-lucide-rotate-ccw"
                                />
                            </UButton>
                        </div>

                        <div
                            v-if="!stats?.topUsers || stats.topUsers.length === 0"
                            class="py-8 text-center"
                        >
                            <UIcon
                                class="mx-auto mb-2 h-12 w-12 text-gray-400"
                                name="i-lucide-inbox"
                            />
                            <p class="text-sm text-gray-500 dark:text-gray-400">No hay usuarios con imágenes generadas</p>
                        </div>
                    </div>
                </UPageCard>
            </div>
        </template>
    </UDashboardPanel>

    <!-- Modal para editar límite -->
    <UModal v-model="isModalOpen">
        <UCard v-if="editingLimit">
            <template #header>
                <h3 class="text-lg font-semibold">Editar Límite de Generación</h3>
            </template>

            <div class="space-y-4">
                <div>
                    <label class="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"> Suscripción: {{ editingLimit.id }} </label>
                    <UInput
                        v-model.number="tempLimit"
                        min="0"
                        placeholder="Límite de imágenes"
                        type="number"
                    />
                    <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">Usa -1 o un número muy alto para límite ilimitado</p>
                </div>
            </div>

            <template #footer>
                <div class="flex justify-end gap-2">
                    <UButton
                        variant="ghost"
                        @click="editingLimit = null"
                    >
                        Cancelar
                    </UButton>
                    <UButton
                        :loading="isUpdating"
                        @click="updateLimit(editingLimit.id)"
                    >
                        Guardar
                    </UButton>
                </div>
            </template>
        </UCard>
    </UModal>
</template>
