<script setup lang="ts">
    definePageMeta({ layout: 'dashboard', middleware: ['auth', 'admin'] })

    useSeoMeta({
        description: 'Gestiona los modelos de IA disponibles',
        title: 'Modelos - Panel de control',
    })

    const route = useRoute()
 
    const key = 'dashboard-model'
 
    const query = computed(() => {
        return {
            page: route.query.page ?? 1,
        }
    })
 
    const { data, refresh } = await useFetch('/api/model', { key, query })
 
    const columns: CommonTableColumn[] = [
        { key: 'name', label: 'Nombre' },
        { key: 'value', label: 'Valor' },
        { class: 'w-px', key: 'roles', label: 'Roles' },
        { class: 'w-px', key: 'active', label: 'Activo' },
        { class: 'w-px text-center', key: 'actions' },
    ]
</script>
 
<template>
    <UDashboardPanel :id="key">
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
                :data="data?.docs"
                :meta="data?.meta"
            >
                <template #roles="{ row }">
                    <TableConstant :value="row.roles" />
                </template>
                <template #active="{ row }">
                    <TableActive
                        :id="row.id"
                        :active="row.active"
                        endpoint="/api/model"
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
