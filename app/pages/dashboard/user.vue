<script setup lang="ts">
    import type { DropdownMenuItem, TableColumn } from '@nuxt/ui'

    definePageMeta({ layout: 'dashboard', middleware: ['auth', 'admin'] })

    useSeoMeta({
        description: 'Gestiona los usuarios del sistema',
        title: 'Usuarios - Admin',
    })

    const ClientOnly = resolveComponent('ClientOnly')
    const UBadge = resolveComponent('UBadge')
    const UButton = resolveComponent('UButton')
    const UDropdownMenu = resolveComponent('UDropdownMenu')
    const USwitch = resolveComponent('USwitch')

    const router = useRouter()
    const { safeExecute } = useSafeError()
    const store = useUsersStore()
    const { users } = storeToRefs(store)

    const { data, refresh } = await useFetch('/api/dashboard/user', {})

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
                icon: 'i-lucide-trash',
                label: 'Eliminar usuario',
                onSelect() {
                    console.log(row)
                },
            },
        ]
    }

    const columns = computed<TableColumn<{ id: string } & UserSchema>[]>(() => {
        return [
            {
                cell: ({ row }) => {
                    return h(
                        ClientOnly,
                        {},
                        {
                            default: () => {
                                const current = users.value[row.original.id]

                                return h(UBadge, {
                                    color: current?.length ? 'success' : 'error',
                                    label: current?.length ? `${current?.length} ${current?.length === 1 ? 'dispositivo' : 'dispositivos'}` : 'Desconectado',
                                })
                            },
                            fallback: () =>
                                h(UBadge, {
                                    color: 'error',
                                    label: 'Desconectado',
                                }),
                        },
                    )
                },
                header: 'Conexión',
                id: 'connected',
                meta: {
                    class: {
                        td: 'w-px',
                        th: 'w-px',
                    },
                },
            },
            {
                accessorKey: 'name',
                header: 'Nombre',
            },
            {
                accessorKey: 'surname',
                header: 'Apellido',
            },
            {
                accessorKey: 'email',
                header: 'Correo electrónico',
            },
            {
                accessorKey: 'role',
                header: 'Rol',
            },
            {
                accessorKey: 'active',
                cell: ({ row }) => {
                    return h(USwitch, {
                        modelValue: row.original.active,
                        'onUpdate:modelValue': async (value: boolean) => {
                            await safeExecute(async () => {
                                await $fetch(`/api/dashboard/user/${row.original.id}`, {
                                    body: { active: value },
                                    method: 'PATCH',
                                })
                                row.original.active = value
                            })
                        },
                    })
                },
                header: 'Activo',
                meta: {
                    class: {
                        td: 'w-px',
                        th: 'w-px',
                    },
                },
            },
            {
                cell: ({ row }) => {
                    return h(
                        'div',
                        { class: 'text-right' },
                        h(
                            UDropdownMenu,
                            {
                                items: getRowItems(row.original),
                            },
                            () =>
                                h(UButton, {
                                    class: 'ml-auto',
                                    color: 'neutral',
                                    icon: 'i-lucide-ellipsis-vertical',
                                    variant: 'ghost',
                                }),
                        ),
                    )
                },
                id: 'actions',
                meta: {
                    class: {
                        td: 'w-px',
                        th: 'w-px',
                    },
                },
            },
        ]
    })
</script>

<template>
    <UDashboardPanel id="dashboard-user">
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
            <DashboardTable
                :columns="columns"
                :data="data"
            />
        </template>
    </UDashboardPanel>
</template>
