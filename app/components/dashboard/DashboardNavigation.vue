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
    const toast = useToast()
    const { user } = useUserSession()
    const { safeExecute } = useSafeError()
    const confirmModal = useConfirmModal()
    const inputModal = useInputModal()

    const { data: navigation, refresh } = useFetch('/api/user/navigation', {
        key: 'dashboard-navigation',
    })

    const items = computed<NavigationMenuItem[][]>(() => {
        const { conversations, instructions } = navigation.value ?? { conversations: [], instructions: [] }

        const items: NavigationMenuItem[][] = []

        items.push([
            {
                icon: 'lucide:home',
                label: 'Inicio',
                to: { name: 'profile' },
            },
            {
                icon: 'lucide:files',
                label: 'Archivos',
                to: { name: 'profile-file' },
            },
            {
                icon: 'lucide:shield',
                label: 'Seguridad',
                to: { name: 'profile-security' },
            },
        ])

        if (user.value?.role === 'ADMIN') {
            items.push([
                {
                    icon: 'lucide:layout-dashboard',
                    label: 'Panel de control',
                    onSelect: () => {
                        open.value = false
                    },
                    to: { name: 'dashboard' },
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
                {
                    icon: 'lucide:brain',
                    label: 'Prompts',
                    onSelect: () => {
                        open.value = false
                    },
                    to: { name: 'dashboard-prompt' },
                },
            ])
        }

        if (user.value?.active) {
            items.push([
                {
                    exactQuery: true,
                    icon: 'lucide:plus',
                    label: 'Nueva conversación',
                    to: { name: 'conversation' },
                },
            ])

            if (instructions.length > 0) {
                items.push([
                    {
                        label: "GPT's",
                        type: 'label',
                    },
                    ...instructions.map((instruction) => ({
                        exactQuery: true,
                        icon: 'lucide:bot',
                        label: instruction.name,
                        to: { name: 'conversation', query: { id: instruction.id } },
                    })),
                ])
            }

            if (conversations.length > 0) {
                items.push([
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
                ])
            }
        }

        return [...items]
    })

    const groups = computed(() => [
        {
            id: 'items',
            items: items.value.flat(),
            label: 'Ir a',
        },
    ])

    const actions = (item: any) => {
        return [
            {
                icon: 'lucide:edit',
                label: 'Renombrar',
                async onSelect() {
                    inputModal.open({
                        confirmButtonLabel: 'Guardar',
                        initialValue: item.label,
                        onConfirm: async (newName: string) => {
                            if (!newName.trim()) return

                            await safeExecute(async () => {
                                await $fetch(`/api/conversation/${item.to.params.id}`, {
                                    body: { name: newName },
                                    method: 'PATCH',
                                })
                                await refresh()
                                toast.add({ color: 'success', title: 'Conversación renombrada' })
                            })
                        },
                        placeholder: 'Nombre de la conversación',
                        title: 'Renombrar conversación',
                    })
                },
            },
            {
                color: 'error',
                icon: 'lucide:trash',
                label: 'Eliminar',
                async onSelect() {
                    confirmModal.open({
                        confirmButtonLabel: 'Eliminar',
                        description: '¿Estás seguro de que deseas eliminar esta conversación? Esta acción no se puede deshacer.',
                        onConfirm: async () => {
                            await safeExecute(async () => {
                                await $fetch(`/api/conversation/${item.to.params.id}`, { method: 'DELETE' })
                                router.push({ name: 'conversation' })
                                toast.add({ color: 'success', title: 'Conversación eliminada' })
                                await refresh()
                            })
                        },
                        title: 'Eliminar conversación',
                    })
                },
            },
        ] satisfies DropdownMenuItem[]
    }
</script>

<template>
    <UDashboardSearchButton
        class="bg-transparent ring-default"
        :collapsed="collapsed"
    />
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
    <UDashboardSearch
        :colorMode="false"
        :groups="groups"
    />
</template>
