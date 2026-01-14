<script setup lang="ts">
    import type { DropdownMenuItem, TableColumn } from '@nuxt/ui'

    definePageMeta({ layout: 'dashboard', middleware: ['auth', 'admin'] })

    const UButton = resolveComponent('UButton')
    const UDropdownMenu = resolveComponent('UDropdownMenu')
    const USwitch = resolveComponent('USwitch')

    const router = useRouter()
    const { safeExecute } = useSafeError()

    const { data, refresh } = await useFetch('/api/instruction/dashboard/list', {})

    function getRowItems(row: { id: string } & InstructionSchema): DropdownMenuItem[] {
        return [
            {
                icon: 'lucide:edit',
                label: 'Editar instrucción',
                async onSelect() {
                    router.push({ name: 'dashboard-instruction', query: { id: row.id } })
                },
            },
            {
                type: 'separator',
            },
            {
                color: 'error',
                icon: 'i-lucide-trash',
                label: 'Eliminar instrucción',
                async onSelect() {
                    await $fetch(`/api/instruction/dashboard/${row.id}`, { method: 'DELETE' })
                    await onRefresh()
                },
            },
        ]
    }

    const columns: TableColumn<{ id: string } & InstructionSchema>[] = [
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
                        await safeExecute(async () => {
                            const formData = new FormData()

                            formData.append('active', String(value))

                            await $fetch(`/api/instruction/dashboard/${row.original.id}`, {
                                body: formData,
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

    async function onRefresh() {
        await refresh()
        await refreshNuxtData('dashboard-navigation')
    }
</script>

<template>
    <UDashboardPanel id="dashboard-instruction">
        <template #header>
            <UDashboardNavbar title="Instrucciones">
                <template #leading>
                    <UDashboardSidebarCollapse />
                </template>

                <template #right>
                    <ModalInstruction @refresh="onRefresh" />
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
