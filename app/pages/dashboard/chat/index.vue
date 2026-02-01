<script setup lang="ts">
    definePageMeta({ layout: 'dashboard', middleware: ['auth', 'admin'] })

    useSeoMeta({
        description: 'Gestiona los chats de los usuarios',
        title: 'Chats - Panel de control',
    })

    const route = useRoute()
 
    const key = 'dashboard-chat'
 
    const query = computed(() => {
        return {
            page: route.query.page ?? 1,
        }
    })
 
    const { data, refresh } = await useFetch('/api/chat', { key, query })
 
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
                    <ModalChat @refresh="refresh" />
                </template>
            </UDashboardNavbar>
        </template>
        <template #body>
            <CommonTable
                :columns="columns"
                :data="data?.docs"
                :meta="data?.meta"
            >
                <template #user="{ row }">
                    <span v-if="row.user">{{ row.user.name }} {{ row.user.surname }}</span>
                    <span v-else>{{ row.userId }}</span>
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
