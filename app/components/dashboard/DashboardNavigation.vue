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

    const { data: navigation, refresh } = useFetch('/api/dashboard/navigation', {
        key: 'dashboard-navigation',
    })

    const items = computed<NavigationMenuItem[][]>(() => {
        const { agents, chats } = navigation.value ?? { agents: [], chats: [] }

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
                {
                    icon: 'lucide:messages-square',
                    label: 'Chats',
                    onSelect: () => {
                        open.value = false
                    },
                    to: { name: 'dashboard-chat' },
                },
                {
                    icon: 'lucide:bot',
                    label: 'Agentes',
                    onSelect: () => {
                        open.value = false
                    },
                    to: { name: 'dashboard-chat-agent' },
                },
                {
                    icon: 'lucide:brain-cog',
                    label: 'Modelos',
                    onSelect: () => {
                        open.value = false
                    },
                    to: { name: 'dashboard-model' },
                },
                {
                    icon: 'lucide:cog',
                    label: 'Configuración',
                    onSelect: () => {
                        open.value = false
                    },
                    to: { name: 'dashboard-setting' },
                },
            ])
        }

        if (user.value?.active) {
            items.push([
                {
                    exactQuery: true,
                    icon: 'lucide:plus',
                    label: 'Nuevo chat',
                    to: { name: 'chat' },
                },
            ])

            if (agents.length > 0) {
                items.push([
                    {
                        label: 'Agentes',
                        type: 'label',
                    },
                    ...agents.map((agent) => ({
                        exactQuery: true,
                        icon: 'lucide:bot-message-square',
                        label: agent.name,
                        to: { name: 'chat-agent-id', params: { id: agent.id } },
                    })),
                ])
            }

            if (chats.length > 0) {
                items.push([
                    {
                        label: 'Tus chats',
                        type: 'label',
                    },
                    ...chats.map((chat) => ({
                        label: chat.name,
                        slot: 'actions' as const,
                        to: { name: 'ai-chat-id', params: { id: chat.id } },
                    })),
                ])
            }
        }

        return [...items]
    })

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
                                await $fetch(`/api/chat/${item.to.params.id}`, {
                                    body: { name: newName },
                                    method: 'PATCH',
                                })
                                await refresh()
                                toast.add({ color: 'success', title: 'Chat renombrado' })
                            })
                        },
                        placeholder: 'Nombre del chat',
                        title: 'Renombrar chat',
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
                        description: '¿Estás seguro de que deseas eliminar este chat? Esta acción no se puede deshacer.',
                        onConfirm: async () => {
                            await safeExecute(async () => {
                                await $fetch(`/api/chat/${item.to.params.id}`, { method: 'DELETE' })
                                router.push({ name: 'chat' })
                                toast.add({ color: 'success', title: 'Chat eliminado' })
                                await refresh()
                            })
                        },
                        title: 'Eliminar chat',
                    })
                },
            },
        ] satisfies DropdownMenuItem[]
    }
</script>

<template>
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
</template>
