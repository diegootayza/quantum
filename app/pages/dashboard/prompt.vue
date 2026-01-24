<script setup lang="ts">
    import type { DropdownMenuItem } from '@nuxt/ui'

    definePageMeta({ layout: 'dashboard', middleware: ['auth', 'admin'] })

    const router = useRouter()

    const { data, refresh } = await useFetch('/api/dashboard/prompt', { method: 'GET' })

    const columns: CommonTableColumn[] = [
        { key: 'description', label: 'Descripción' },
        { class: 'w-px', key: 'key', label: 'Clave' },
        { class: 'w-px text-center', key: 'actions' },
    ]

    function getRowItems(row: { id: string } & PromptSchema): DropdownMenuItem[] {
        return [
            {
                icon: 'lucide:edit',
                label: 'Editar prompt',
                async onSelect() {
                    router.push({ name: 'dashboard-prompt', query: { id: row.id } })
                },
            },
            {
                type: 'separator',
            },
            {
                color: 'error',
                icon: 'lucide:trash',
                label: 'Eliminar prompt',
                async onSelect() {
                    await $fetch(`/api/dashboard/prompt/${row.id}`, { method: 'DELETE' })
                    await refresh()
                },
            },
        ]
    }
</script>

<template>
    <UDashboardPanel id="prompt">
        <template #header>
            <UDashboardNavbar title="Prompts">
                <template #leading>
                    <UDashboardSidebarCollapse />
                </template>
                <template #right>
                    <ModalPrompt @refresh="refresh" />
                </template>
            </UDashboardNavbar>
        </template>
        <template #body>
            <CommonTable
                :columns="columns"
                :data="data"
            >
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
