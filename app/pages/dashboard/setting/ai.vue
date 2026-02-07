<script setup lang="ts">
    definePageMeta({ layout: 'dashboard', middleware: ['auth', 'admin'] })

    const { data } = await useApiGetData<API.Setting>(`${API_ENDPOINT.SETTING_NAMESPACE}/ai`)
</script>

<template>
    <DashboardPage
        :id="PAGE_NAME.DASHBOARD_SETTING_AI"
        title="Configuración - IA"
    >
        <pre>{{ data }}</pre>
    </DashboardPage>
</template>
