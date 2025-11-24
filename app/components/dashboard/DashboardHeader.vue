<script setup lang="ts">
    interface Props {
        description?: string
        showNotifications?: boolean
        title: string
    }

    withDefaults(defineProps<Props>(), {
        description: undefined,
        showNotifications: false,
    })
</script>

<template>
    <UDashboardNavbar :ui="{ right: 'gap-3' }">
        <template #title>
            <div class="md:ml-4">
                <h2 class="font-bold">{{ title }}</h2>
                <p
                    v-if="description"
                    class="font-medium text-xs text-neutral-300"
                >
                    {{ description }}
                </p>
            </div>
        </template>
        <template #leading>
            <UDashboardSidebarCollapse />
        </template>
        <template #right>x</template>
    </UDashboardNavbar>
</template>
