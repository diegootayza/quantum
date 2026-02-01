<script setup lang="ts">
    definePageMeta({ layout: 'dashboard', middleware: ['auth', 'admin'] })

    useSeoMeta({
        description: 'Gestiona los prompts del sistema',
        title: 'Prompts - Panel de control',
    })

    const route = useRoute()
 
    const key = 'dashboard-prompt'
 
    const query = computed(() => {
        return {
            page: route.query.page ?? 1,
        }
    })
 
    const { data } = await useFetch('/api/prompt', { key, query })
 
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
                :data="data?.docs"
                :meta="data?.meta"
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
