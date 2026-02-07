<script setup lang="ts">
    import type { ChatStatus, UIMessage } from 'ai'

    definePageMeta({ key: (route) => `chat-agent-${route.params.id}`, layout: 'dashboard', middleware: ['auth'] })

    const route = useRoute()

    const axios = useAxios()

    const { data } = await useApiGetData<API.ChatAgent>(`${API_ENDPOINT.CHAT_AGENT_READ}/${route.params.id}`)

    if (!data.value) {
        throw createError({
            statusCode: 404,
            statusMessage: 'Agente de chat no encontrado',
        })
    }

    useSeoMeta({
        title: () => data.value?.name || 'Chat AI',
    })

    const status = ref<ChatStatus>('ready')

    const { markClean, markDirty } = useLeavePrevent()

    async function onSubmit(parts: UIMessage['parts'], clean: () => void) {
        status.value = 'submitted'
        clean()

        const id = await safeExecute(async () => {
            const { data } = await axios.post<string>(API_ENDPOINT.AI_CHAT_CREATE, { agentId: route.params.id, parts })
            return data
        })

        status.value = 'ready'
        if (id) navigateTo({ name: PAGE_NAME.PROFILE_CHAT_ID, params: { id }, query: { new: 'true' } })
    }

    watch(status, (v) => {
        if (['streaming', 'submitted'].includes(v)) markDirty()
        else markClean()
    })
</script>

<template>
    <UDashboardPanel :id="`chat-agent-${route.params.id}`">
        <template #header>
            <UDashboardNavbar :title="data?.name || 'Chat AI'">
                <template #leading>
                    <UDashboardSidebarCollapse />
                </template>
            </UDashboardNavbar>
        </template>
        <template #body>
            <div class="flex-1 flex flex-col gap-8 p-4 items-center justify-center">
                <div class="flex flex-col items-center justify-center gap-4 w-full">
                    <h1 class="text-3xl sm:text-4xl text-center text-highlighted font-bold">{{ data?.name }}</h1>
                    <p class="text-center text-base text-muted-foreground">{{ data?.description }}</p>
                </div>
                <div class="w-full max-w-6xl">
                    <ChatForm
                        hideModel
                        :status="status"
                        @submit="onSubmit"
                    />
                </div>
            </div>
        </template>
    </UDashboardPanel>
</template>
