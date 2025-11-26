<script setup lang="ts">
    definePageMeta({ layout: 'dashboard', middleware: 'auth' })
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
    </UDashboardPanel>
</template>
