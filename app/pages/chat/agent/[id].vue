<script setup lang="ts">
    import type { ChatStatus, UIMessage } from 'ai'

    definePageMeta({ key: (route) => `chat-agent-${route.params.id}`, layout: 'dashboard', middleware: ['auth'] })

    const route = useRoute()
    const router = useRouter()

    const { data, error } = await useFetch(`/api/chat-agent/${route.params.id}`, { key: `chat-agent-${route.params.id}` })

    if (error.value) {
        throw createError({
            statusCode: error.value.statusCode || 500,
            statusMessage: error.value.statusMessage || 'Error fetching instruction data.',
        })
    }

    const status = ref<ChatStatus>('ready')

    async function onSubmit(parts: UIMessage['parts'], clean: () => void) {
        status.value = 'submitted'
        clean()
        const response = await $fetch('/api/ai', { body: { agentId: route.params.id, parts }, method: 'POST' })
        router.push({ name: 'ai-chat-id', params: { id: response.id }, query: { new: 'true' } })
    }
</script>

<template>
    <UDashboardPanel :id="`chat-agent-${route.params.id}`">
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
    </UDashboardPanel>
</template>
