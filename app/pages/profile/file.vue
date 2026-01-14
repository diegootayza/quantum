<script setup lang="ts">
    definePageMeta({ layout: 'dashboard', middleware: 'auth' })

    const { data } = await useFetch('/api/attachment', {})

    const items = computed(() => data.value || [])
</script>

<template>
    <UDashboardPanel id="profile-file">
        <template #header>
            <UDashboardNavbar title="Archivos">
                <template #leading>
                    <UDashboardSidebarCollapse />
                </template>
            </UDashboardNavbar>
        </template>

        <template #body>
            <!-- Empty State -->
            <div
                v-if="items.length === 0"
                class="flex flex-col items-center justify-center py-16 px-4"
            >
                <div class="flex flex-col items-center gap-4 max-w-md text-center">
                    <div class="p-4 rounded-full bg-gray-100 dark:bg-gray-800">
                        <UIcon
                            class="w-12 h-12 text-gray-400 dark:text-gray-600"
                            name="i-lucide-folder-open"
                        />
                    </div>
                    <div class="space-y-2">
                        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">No hay archivos</h3>
                        <p class="text-sm text-gray-500 dark:text-gray-400">Aún no has subido ningún archivo. Los archivos que subas en tus conversaciones aparecerán aquí.</p>
                    </div>
                </div>
            </div>

            <!-- Files Grid -->
            <div
                v-else
                class="w-full grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4"
            >
                <UCard
                    v-for="(item, index) in items"
                    :key="index"
                    class="aspect-square"
                    :ui="{
                        body: 'flex size-full items-center justify-center p-0 sm:p-0',
                    }"
                >
                    <img
                        :alt="item.id"
                        class="aspect-square object-contain"
                        :src="item.url!"
                    />
                </UCard>
            </div>
        </template>
    </UDashboardPanel>
</template>
