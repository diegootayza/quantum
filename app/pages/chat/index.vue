<script setup lang="ts">
    import type { ChatStatus, UIMessage } from 'ai'

    definePageMeta({ key: 'chat', layout: 'dashboard', middleware: ['auth'] })

    const router = useRouter()

    const status = ref<ChatStatus>('ready')

    async function onSubmit(parts: UIMessage['parts'], clean: () => void) {
        status.value = 'submitted'
        clean()
        const response = await $fetch('/api/ai', { body: { parts }, method: 'POST' })
        router.push({ name: 'ai-chat-id', params: { id: response.id }, query: { new: 'true' } })
    }
</script>

<template>
    <UDashboardPanel id="chat">
        <div class="flex-1 flex flex-col gap-8 p-4 items-center justify-center">
            <div class="flex flex-col items-center justify-center gap-4 w-full">
                <h1 class="text-3xl sm:text-4xl text-center text-highlighted font-bold">¿En que estas trabajando?</h1>
            </div>
            <div class="w-full max-w-6xl">
                <ChatForm
                    :status="status"
                    @submit="onSubmit"
                />
            </div>
        </div>
    </UDashboardPanel>
</template>
