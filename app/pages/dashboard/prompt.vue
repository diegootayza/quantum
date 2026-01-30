<script setup lang="ts">
    definePageMeta({ layout: 'dashboard', middleware: ['auth', 'admin'] })

    useSeoMeta({
        description: 'Gestiona los usuarios del sistema',
        title: 'Prompts - Panel de control - Quantum',
    })

    const key = 'dashboard-prompt'

    const { data } = await useFetch('/api/prompt', { key })

    const columns: CommonTableColumn[] = [
        { key: 'description', label: 'Descripción' },
        { class: 'w-px', key: 'key', label: 'Clave' },
        { class: 'w-px text-center', key: 'actions' },
    ]
</script>

<template>
    <UDashboardPanel :id="key">
        <template #header>
            <UDashboardNavbar title="Prompts">
                <template #leading>
                    <UDashboardSidebarCollapse />
                </template>
                <template #right>
                    <ModalPrompt />
                </template>
            </UDashboardNavbar>
        </template>
        <template #body>
            <CommonTable
                :columns="columns"
                :data="data"
            >
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
