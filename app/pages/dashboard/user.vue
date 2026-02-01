<script setup lang="ts">
    definePageMeta({ layout: 'dashboard', middleware: ['auth', 'admin'] })

    useSeoMeta({
        description: 'Gestiona los usuarios del sistema',
        title: 'Usuarios - Panel de control',
    })

    const socket = useSocket()

    const route = useRoute()

    const key = 'dashboard-user'

    const query = computed(() => {
        return {
            page: route.query.page ?? 1,
        }
    })

    const { data, refresh } = await useFetch('/api/user', { key, query })

    const columns: CommonTableColumn[] = [
        { class: 'w-px', key: 'devices', label: 'Dispositivos' },
        { class: 'w-px', key: 'name', label: 'Nombre' },
        { class: 'w-px', key: 'surname', label: 'Apellido' },
        { class: 'w-px', key: 'role', label: 'Rol' },
        { key: 'email', label: 'Correo electrónico' },
        { class: 'w-px', key: 'session', label: 'Sesión' },
        { class: 'w-px text-center', key: 'active', label: 'Activo' },
        { class: 'w-px text-center', key: 'actions' },
    ]

    function onSession(id: string) {
        socket?.emit('user:signout', id)
    }

    function onUpdate(id: string) {
        socket?.emit('user:update', id)
    }
</script>

<template>
    <UDashboardPanel :id="key">
        <template #header>
            <UDashboardNavbar title="Usuarios">
                <template #leading>
                    <UDashboardSidebarCollapse />
                </template>
                <template #right>
                    <ModalUser @refresh="refresh" />
                </template>
            </UDashboardNavbar>
        </template>
        <template #body>
            <CommonTable
                :columns="columns"
                :data="data?.docs"
                :meta="data?.meta"
            >
                <template #devices="{ row }">
                    <TableDevice :id="row.id" />
                </template>
                <template #role="{ row }">
                    <TableConstant :value="row.role" />
                </template>
                <template #active="{ row }">
                    <TableActive
                        :id="row.id"
                        :active="row.active"
                        endpoint="/api/user"
                        :name="key"
                        @update="onUpdate"
                    />
                </template>
                <template #session="{ row }">
                    <UButton
                        color="error"
                        label="Cerrar sesión"
                        variant="subtle"
                        @click="onSession(row.id)"
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
