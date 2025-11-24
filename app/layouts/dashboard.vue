<script setup lang="ts">
    import type { NavigationMenuItem } from '@nuxt/ui'

    const open = ref(false)

    const items = [
        [
            {
                icon: 'lucide:layout-dashboard',
                label: 'Panel de control',
                onSelect: () => {
                    open.value = false
                },
                to: { name: 'dashboard' },
            },
            {
                icon: 'lucide:folders',
                label: 'Categorías',
                onSelect: () => {
                    open.value = false
                },
                to: { name: 'dashboard-category' },
            },
            {
                icon: 'lucide:bot',
                label: 'Instrucciones',
                onSelect: () => {
                    open.value = false
                },
                to: { name: 'dashboard-instruction' },
            },
            {
                icon: 'lucide:messages-square',
                label: 'Conversaciones',
                onSelect: () => {
                    open.value = false
                },
                to: { name: 'dashboard-conversation' },
            },
            {
                icon: 'lucide:users',
                label: 'Usuarios',
                onSelect: () => {
                    open.value = false
                },
                to: { name: 'dashboard-user' },
            },
        ],
        [
            {
                icon: 'lucide:plus',
                label: 'Nueva conversación',
                to: { name: 'conversation' },
            },
        ],
        [
            {
                label: "GPT's",
                type: 'label',
            },
            {
                icon: 'lucide:bot',
                label: 'Dashboard',
                onSelect: () => {},
            },
            {
                icon: 'lucide:bot',
                label: 'Instrucciones',
                onSelect: () => {},
            },
        ],
        [
            {
                label: 'Conversaciones',
                type: 'label',
            },
            {
                icon: 'lucide:message-square',
                label: 'Dashboard',
                onSelect: () => {},
                slot: 'actions' as const,
            },
            {
                icon: 'lucide:message-square',
                label: 'Instrucciones',
                onSelect: () => {},
                slot: 'actions' as const,
            },
        ],
    ] satisfies NavigationMenuItem[][]

    const groups = computed(() => [
        {
            id: 'items',
            items: items.flat(),
            label: 'Ir a',
        },
    ])
</script>

<template>
    <UDashboardGroup unit="rem">
        <UDashboardSidebar
            id="default"
            v-model:open="open"
            class="bg-elevated/25"
            collapsible
            :ui="{ footer: 'lg:border-t lg:border-default', header: 'm-0 p-0 h-auto border-0' }"
        >
            <template #header>
                <div class="grid place-items-center h-16 w-full">Quantum</div>
            </template>
            <template #default="{ collapsed }">
                <UDashboardSearchButton
                    class="bg-transparent ring-default"
                    :collapsed="collapsed"
                />

                <DashboardNavigation
                    v-model:open="open"
                    :collapsed="collapsed"
                />
            </template>

            <template #footer="{ collapsed }">
                <UserMenu :collapsed="collapsed" />
            </template>
        </UDashboardSidebar>

        <UDashboardSearch
            :colorMode="false"
            :groups="groups"
        />

        <slot />
    </UDashboardGroup>
</template>
