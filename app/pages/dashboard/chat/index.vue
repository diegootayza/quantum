vue
<script setup lang="ts">
    definePageMeta({ layout: 'dashboard', middleware: ['auth', 'admin'] })

    useSeoMeta({
        description: 'Gestiona los agentes del sistema',
        title: 'Agentes - Panel de control - Quantum',
    })

    const key = 'dashboard-chat'

    const { data } = await useFetch('/api/chat', { key, query: { user: 'true' } })

    const columns: CommonTableColumn[] = [
        { key: 'name', label: 'Nombre' },
        { key: 'user', label: 'Usuario' },
        { class: 'w-px text-center', key: 'actions' },
    ]
</script>

<template>
    <UDashboardPanel :id="key">
        <template #header>
            <UDashboardNavbar title="Chats">
                <template #leading>
                    <UDashboardSidebarCollapse />
                </template>
                <template #right>
                    <ModalChat />
                </template>
            </UDashboardNavbar>
        </template>
        <template #body>
            <CommonTable
                :columns="columns"
                :data="data"
            >
                <template #user="{ row }">
                    <span>{{ row.user?.name }} {{ row.user?.surname }}</span>
                </template>
                <template #actions="{ row }">
                    <TableAction
                        :id="row.id"
                        :name="key"
                    />
                </template>
            </CommonTable>
        </template>
    </UDashboardPanel>
</template>
