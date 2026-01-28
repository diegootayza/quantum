vue
<script setup lang="ts">
    definePageMeta({ layout: 'dashboard', middleware: ['auth', 'admin'] })

    useSeoMeta({
        description: 'Gestiona los agentes del sistema',
        title: 'Agentes - Panel de control - Quantum',
    })

    const { data, refresh } = await useFetch('/api/chat-agent', { key: 'dashboard-chat-agent' })

    const columns: CommonTableColumn[] = [
        { key: 'name', label: 'Nombre' },
        { key: 'description', label: 'Descripción' },
        { key: 'model', label: 'Modelo' },
        { class: 'w-px', key: 'active', label: 'Activo' },
        { class: 'w-px text-center', key: 'actions' },
    ]
</script>

<template>
    <UDashboardPanel id="chat-agent">
        <template #header>
            <UDashboardNavbar title="Agentes">
                <template #leading>
                    <UDashboardSidebarCollapse />
                </template>
                <template #right>
                    <ModalChatAgent @refresh="refresh" />
                </template>
            </UDashboardNavbar>
        </template>
        <template #body>
            <CommonTable
                :columns="columns"
                :data="data"
            >
                <template #active="{ row }">
                    <TableActive
                        :id="row.id"
                        :active="row.active"
                        endpoint="/api/chat-agent"
                        name="dashboard-chat-agent"
                    />
                </template>
                <template #actions="{ row }">
                    <TableAction
                        :id="row.id"
                        name="dashboard-chat-agent"
                    />
                </template>
            </CommonTable>
        </template>
    </UDashboardPanel>
</template>
