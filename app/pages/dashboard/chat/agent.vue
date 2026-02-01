<script setup lang="ts">
    definePageMeta({ layout: 'dashboard', middleware: ['auth', 'admin'] })

    useSeoMeta({
        description: 'Gestiona los agentes del sistema',
        title: 'Agentes - Panel de control',
    })

    const route = useRoute()
 
    const key = 'dashboard-chat-agent'
 
    const query = computed(() => {
        return {
            page: route.query.page ?? 1,
        }
    })
 
    const { data, refresh } = await useFetch('/api/chat-agent', { key, query })
 
    const columns: CommonTableColumn[] = [
        { key: 'name', label: 'Nombre' },
        { key: 'description', label: 'Descripción' },
        { key: 'model', label: 'Modelo' },
        { class: 'w-px', key: 'active', label: 'Activo' },
        { class: 'w-px text-center', key: 'actions' },
    ]
</script>
 
<template>
    <UDashboardPanel :id="key">
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
                :data="data?.docs"
                :meta="data?.meta"
            >
                <template #active="{ row }">
                    <TableActive
                        :id="row.id"
                        :active="row.active"
                        endpoint="/api/chat-agent"
                        :name="key"
                    />
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
