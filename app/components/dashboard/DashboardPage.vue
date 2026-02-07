<script setup lang="ts">
    interface Props {
        id: string
        title: string
    }

    const props = withDefaults(defineProps<Props>(), {})
</script>

<template>
    <UDashboardPanel
        :id="props.id"
        :ui="{ body: 'p-0 sm:p-0' }"
    >
        <template #header>
            <UDashboardNavbar :title="props.title">
                <template #leading>
                    <UDashboardSidebarCollapse />
                </template>
                <template #right>
                    <slot name="headerRight" />
                </template>
            </UDashboardNavbar>
        </template>
        <template #body>
            <slot />
        </template>
    </UDashboardPanel>
</template>
