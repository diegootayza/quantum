<script setup lang="ts">
    import type { ChatStatus, UIMessage } from 'ai'

    definePageMeta({ key: 'chat', layout: 'dashboard', middleware: ['auth'] })

    const router = useRouter()

    const status = ref<ChatStatus>('ready')

    let controller: AbortController | null = null

    const { markClean, markDirty } = useLeavePrevent({
        onCancel() {
            controller?.abort()
        },
    })

    async function onSubmit(parts: UIMessage['parts'], clean: () => void) {
        controller?.abort()

        controller = new AbortController()

        status.value = 'submitted'
        clean()
        const response = await $fetch('/api/ai', { body: { parts }, method: 'POST', signal: controller.signal })
        status.value = 'ready'
        router.push({ name: 'ai-chat-id', params: { id: response.id }, query: { new: 'true' } })
    }

    watch(status, (v) => {
        if (['streaming', 'submitted'].includes(v)) markDirty()
        else markClean()
    })
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
