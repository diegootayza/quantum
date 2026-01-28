vue
<script setup lang="ts">
    definePageMeta({ layout: 'dashboard', middleware: ['auth', 'admin'] })

    useSeoMeta({
        description: 'Gestiona los usuarios del sistema',
        title: 'Modelos - Panel de control - Quantum',
    })

    const { data, refresh } = await useFetch('/api/model', { key: 'dashboard-model' })

    const columns: CommonTableColumn[] = [
        { key: 'name', label: 'Nombre' },
        { key: 'value', label: 'Valor' },
        { class: 'w-px', key: 'roles', label: 'Roles' },
        { class: 'w-px', key: 'active', label: 'Activo' },
        { class: 'w-px text-center', key: 'actions' },
    ]
</script>

<template>
    <UDashboardPanel id="model">
        <template #header>
            <UDashboardNavbar title="Modelos">
                <template #leading>
                    <UDashboardSidebarCollapse />
                </template>
                <template #right>
                    <ModalModel @refresh="refresh" />
                </template>
            </UDashboardNavbar>
        </template>
        <template #body>
            <CommonTable
                :columns="columns"
                :data="data"
            >
                <template #roles="{ row }">
                    <TableConstant :value="row.roles" />
                </template>
                <template #active="{ row }">
                    <TableActive
                        :id="row.id"
                        :active="row.active"
                        endpoint="/api/model"
                        name="dashboard-model"
                    />
                </template>
                <template #actions="{ row }">
                    <TableAction
                        :id="row.id"
                        name="dashboard-model"
                    />
                </template>
            </CommonTable>
        </template>
    </UDashboardPanel>
</template>
