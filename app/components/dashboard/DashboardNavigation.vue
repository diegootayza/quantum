<script setup lang="ts">
    import type { DropdownMenuItem, NavigationMenuItem } from '@nuxt/ui'

    interface Props {
        collapsed?: boolean
    }

    withDefaults(defineProps<Props>(), {
        collapsed: false,
    })

    const open = defineModel('open', { default: false, type: Boolean })

    const toast = useToast()
    const { user } = useData()
    const { safeExecute } = useSafeError()
    const confirmModal = useConfirmModal()
    const inputModal = useInputModal()

    const apiChat = useApiChat()

    const { data, refresh } = await useApiGetData<API.ProfileNavigation>(API_ENDPOINT.PROFILE_NAVIGATION)

    const items = computed<NavigationMenuItem[][]>(() => {
        const { agents, chats } = data.value ?? { agents: [], chats: [] }

        const items: NavigationMenuItem[][] = []

        items.push([
            {
                icon: 'lucide:home',
                label: 'Inicio',
                to: { name: PAGE_NAME.PROFILE },
            },
            {
                icon: 'lucide:files',
                label: 'Archivos',
                to: { name: PAGE_NAME.PROFILE_FILE },
            },
            {
                icon: 'lucide:shield',
                label: 'Seguridad',
                to: { name: PAGE_NAME.PROFILE_SECURITY },
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
                    to: { name: PAGE_NAME.DASHBOARD },
                },
                {
                    icon: 'lucide:users',
                    label: 'Usuarios',
                    onSelect: () => {
                        open.value = false
                    },
                    to: { name: PAGE_NAME.DASHBOARD_USER },
                },
                {
                    icon: 'lucide:brain',
                    label: 'Prompts',
                    onSelect: () => {
                        open.value = false
                    },
                    to: { name: PAGE_NAME.DASHBOARD_PROMPT },
                },
                {
                    icon: 'lucide:messages-square',
                    label: 'Chats',
                    onSelect: () => {
                        open.value = false
                    },
                    to: { name: PAGE_NAME.DASHBOARD_CHAT },
                },
                {
                    icon: 'lucide:bot',
                    label: 'Agentes',
                    onSelect: () => {
                        open.value = false
                    },
                    to: { name: PAGE_NAME.DASHBOARD_CHAT_AGENT },
                },
                {
                    icon: 'lucide:brain-cog',
                    label: 'Modelos',
                    onSelect: () => {
                        open.value = false
                    },
                    to: { name: PAGE_NAME.DASHBOARD_MODEL },
                },
                {
                    icon: 'lucide:files',
                    label: 'Archivos',
                    onSelect: () => {
                        open.value = false
                    },
                    to: { name: PAGE_NAME.DASHBOARD_FILE },
                },
                {
                    icon: 'lucide:cog',
                    label: 'Configuración',
                    onSelect: () => {
                        open.value = false
                    },
                    to: { name: PAGE_NAME.DASHBOARD_SETTING },
                },
            ])
        }

        if (user.value?.active) {
            items.push([
                {
                    exactQuery: true,
                    icon: 'lucide:plus',
                    label: 'Nuevo chat',
                    to: { name: PAGE_NAME.PROFILE_CHAT },
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
                        to: { name: PAGE_NAME.PROFILE_CHAT_AGENT_ID, params: { id: agent.id } },
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
                        to: { name: PAGE_NAME.PROFILE_CHAT_ID, params: { id: chat.id } },
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
                                await apiChat.updateChat(item.to.params.id, { name: newName })
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
                                await apiChat.deleteChat(item.to.params.id)
                                navigateTo({ name: PAGE_NAME.PROFILE_CHAT })
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
                    <UButton
                        color="neutral"
                        icon="lucide:ellipsis-vertical"
                        size="xs"
                        variant="ghost"
                    />
                </template>
            </ClientOnly>
        </template>
    </UNavigationMenu>
</template>
