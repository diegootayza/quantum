<script setup lang="ts">
    import type { DropdownMenuItem, TableColumn } from '@nuxt/ui'

    definePageMeta({ layout: 'dashboard', middleware: ['auth', 'admin'] })

    const UButton = resolveComponent('UButton')
    const UDropdownMenu = resolveComponent('UDropdownMenu')
    const USwitch = resolveComponent('USwitch')

    const router = useRouter()
    const { safeExecute } = useSafeError()

    const { data, refresh } = await useFetch('/api/dashboard/subscription', {})

    function getRowItems(row: { id: string } & SubscriptionSchema): DropdownMenuItem[] {
        return [
            {
                icon: 'lucide:edit',
                label: 'Editar suscripción',
                async onSelect() {
                    router.push({ name: 'dashboard-subscription', query: { id: row.id } })
                },
            },
            {
                type: 'separator',
            },
            {
                color: 'error',
                icon: 'i-lucide-trash',
                label: 'Eliminar suscripción',
                async onSelect() {
                    await safeExecute(async () => {
                        await $fetch(`/api/dashboard/subscription/${row.id}`, {
                            method: 'DELETE',
                        })
                        refresh()
                    })
                },
            },
        ]
    }

    const columns: TableColumn<{ id: string } & SubscriptionSchema>[] = [
        {
            accessorKey: 'name',
            header: 'Nombre',
        },
        {
            accessorKey: 'price',
            header: 'Precio',
            cell: ({ row }) => `${row.original.price} ${row.original.currency}`,
        },
        {
            accessorKey: 'interval',
            header: 'Intervalo',
        },
        {
            accessorKey: 'active',
            cell: ({ row }) => {
                return h(USwitch, {
                    modelValue: row.original.active,
                    'onUpdate:modelValue': async (value: boolean) => {
                        await safeExecute(async () => {
                            await $fetch(`/api/dashboard/subscription/${row.original.id}`, {
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
    <UDashboardPanel id="dashboard-subscription">
        <template #header>
            <UDashboardNavbar title="Suscripciones">
                <template #leading>
                    <UDashboardSidebarCollapse />
                </template>

                <template #right>
                    <ModalSubscription @refresh="refresh" />
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
