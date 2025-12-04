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
                children: [
                    // {
                    //     label: 'Cuenta',
                    //     to: { name: 'profile-security' },
                    // },
                    {
                        label: 'Seguridad',
                        to: { name: 'profile-security' },
                    },
                    {
                        label: 'Suscripción',
                        to: { name: 'profile-subscription' },
                    },
                    // {
                    //     label: 'Notificaciones',
                    //     to: { name: 'profile-security' },
                    // },
                ],
                defaultOpen: true,
                icon: 'lucide:settings',
                label: 'Configuración',
                type: 'trigger',
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
                {
                    icon: 'lucide:credit-card',
                    label: 'Suscripciones',
                    onSelect: () => {
                        open.value = false
                    },
                    to: { name: 'dashboard-subscription' },
                },
                {
                    icon: 'lucide:cpu',
                    label: 'Servicios',
                    onSelect: () => {
                        open.value = false
                    },
                    to: { name: 'dashboard-service' },
                },
                {
                    children: [
                        {
                            label: 'IA',
                            to: { name: 'dashboard-setting-ai' },
                        },
                    ],
                    defaultOpen: true,
                    icon: 'lucide:settings',
                    label: 'Ajustes',
                    onSelect: () => {
                        open.value = false
                    },
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
                async onSelect() {},
            },
            {
                color: 'error',
                icon: 'lucide:trash',
                label: 'Eliminar',
                async onSelect() {
                    try {
                        await $fetch(`/api/conversation/${item.to.params.id}`, { method: 'DELETE' })
                        await refresh()
                        router.push({ name: 'conversation' })
                        toast.add({ color: 'success', title: 'Conversación eliminada' })
                    } catch (error) {
                        console.log(error)
                    }
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
