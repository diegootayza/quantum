<script setup lang="ts">
    import type { DropdownMenuItem } from '@nuxt/ui'

    definePageMeta({ layout: 'dashboard', middleware: ['auth', 'admin'] })

    useSeoMeta({
        description: 'Gestiona los usuarios del sistema',
        title: 'Usuarios - Admin',
    })

    const router = useRouter()

    const { data, refresh } = await useFetch('/api/dashboard/user', {
        key: 'dashboard-user',
    })

    function getRowItems(row: { id: string } & UserSchema): DropdownMenuItem[] {
        return [
            {
                icon: 'lucide:edit',
                label: 'Editar usuario',
                async onSelect() {
                    router.push({ name: 'dashboard-user', query: { id: row.id } })
                },
            },
            {
                type: 'separator',
            },
            {
                color: 'error',
                icon: 'lucide:trash',
                label: 'Eliminar usuario',
                onSelect() {
                    console.log(row)
                },
            },
        ]
    }

    const columns: CommonTableColumn[] = [
        { class: 'w-px', key: 'devices', label: 'Dispositivos' },
        { class: 'w-px', key: 'name', label: 'Nombre' },
        { class: 'w-px', key: 'surname', label: 'Apellido' },
        { class: 'w-px', key: 'role', label: 'Rol' },
        { key: 'email', label: 'Correo electrónico' },
        { class: 'w-px', key: 'active', label: 'Activo' },
        { class: 'w-px text-center', key: 'actions' },
    ]
</script>

<template>
    <UDashboardPanel id="user">
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
                :data="data"
            >
                <template #devices="{ row }">
                    <TableDevice :id="row.id" />
                </template>
                <template #active="{ row }">
                    <TableActive :row="row" />
                </template>
                <template #actions="{ row }">
                    <UDropdownMenu :items="getRowItems(row)">
                        <UButton
                            color="neutral"
                            icon="lucide:ellipsis-vertical"
                            variant="ghost"
                        />
                    </UDropdownMenu>
                </template>
            </CommonTable>
        </template>
    </UDashboardPanel>
</template>
