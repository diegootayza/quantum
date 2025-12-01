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
            <div class="w-full grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4">
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
