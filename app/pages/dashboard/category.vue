<script setup lang="ts">
    import type { DropdownMenuItem, TableColumn } from '@nuxt/ui'

    definePageMeta({ layout: 'dashboard', middleware: 'auth' })

    const UButton = resolveComponent('UButton')
    const UDropdownMenu = resolveComponent('UDropdownMenu')
    const USwitch = resolveComponent('USwitch')

    const router = useRouter()

    const { data, refresh } = await useFetch('/api/dashboard/category', {})

    function getRowItems(row: { id: string } & CategorySchema): DropdownMenuItem[] {
        return [
            {
                icon: 'lucide:edit',
                label: 'Editar categoría',
                async onSelect() {
                    router.push({ name: 'dashboard-category', query: { id: row.id } })
                },
            },
            {
                type: 'separator',
            },
            {
                color: 'error',
                icon: 'i-lucide-trash',
                label: 'Eliminar instrucción',
                onSelect() {
                    console.log(row)
                },
            },
        ]
    }

    const columns: TableColumn<{ id: string } & CategorySchema>[] = [
        {
            accessorKey: 'name',
            header: 'Nombre',
        },
        {
            accessorKey: 'active',
            cell: ({ row }) => {
                return h(USwitch, {
                    modelValue: row.original.active,
                    'onUpdate:modelValue': async (value: boolean) => {
                        await $fetch(`/api/dashboard/category/${row.original.id}`, {
                            body: { active: value },
                            method: 'PATCH',
                        })
                        row.original.active = value
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
                            })
                    )
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
</script>

<template>
    <UDashboardPanel id="dashboard-category">
        <template #header>
            <UDashboardNavbar title="Categorías">
                <template #leading>
                    <UDashboardSidebarCollapse />
                </template>

                <template #right>
                    <ModalCategory @refresh="refresh" />
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
