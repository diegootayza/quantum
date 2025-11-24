<script setup lang="ts">
    definePageMeta({ layout: 'dashboard', middleware: 'auth' })
</script>

<template>
    <UDashboardPanel id="dashboard">
        <template #body> Panel de control </template>
    </UDashboardPanel>
</template>
