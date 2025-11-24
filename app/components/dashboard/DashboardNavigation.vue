<script setup lang="ts">
    import type { DropdownMenuItem, NavigationMenuItem } from '@nuxt/ui'

    interface Props {
        collapsed?: boolean
    }

    withDefaults(defineProps<Props>(), {
        collapsed: false,
    })

    const open = defineModel('open', { default: false, type: Boolean })

    const router = useRouter()

    const { data, refresh } = useFetch('/api/user/navigation', {
        key: 'dashboard-navigation',
    })

    const items = computed<NavigationMenuItem[][]>(() => {
        const { conversations } = data.value ?? { conversations: [] }

        return [
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
                ...conversations.map((conversation) => ({
                    icon: 'lucide:message-square',
                    label: conversation.name,
                    slot: 'actions' as const,
                    to: { name: 'conversation-id', params: { id: conversation.id } },
                })),
            ],
        ]
    })

    const actions = (item: any) => {
        return [
            {
                icon: 'lucide:edit',
                label: 'Renombrar',
                async onSelect() {},
            },
            {
                icon: 'lucide:trash',
                label: 'Eliminar',
                async onSelect() {
                    await $fetch(`/api/conversation/${item.to.params.id}`, { method: 'DELETE' })
                    await refresh()
                    router.push({ name: 'conversation' })
                },
            },
        ] satisfies DropdownMenuItem[]
    }
</script>

<template>
    <div>
        <UNavigationMenu
            class="h-full"
            :collapsed="collapsed"
            :items="items"
            orientation="vertical"
        >
            <template #actions-trailing="{ item }">
                <ClientOnly>
                    <UDropdownMenu
                        :content="{
                            align: 'start',
                            side: 'right',
                            sideOffset: 8,
                        }"
                        :items="actions(item)"
                    >
                        <UButton
                            color="neutral"
                            icon="lucide:ellipsis-vertical"
                            size="xs"
                            variant="ghost"
                        />
                    </UDropdownMenu>
                    <template #fallback>
                        <div class="size-6" />
                    </template>
                </ClientOnly>
            </template>
        </UNavigationMenu>
    </div>
</template>
