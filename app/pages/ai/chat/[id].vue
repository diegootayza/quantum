<script setup lang="ts">
    import type { UIMessage } from 'ai'

    import { Chat } from '@ai-sdk/vue'
    import { DefaultChatTransport } from 'ai'

    definePageMeta({ key: (route) => `ai-chat-${route.params.id}`, layout: 'dashboard', middleware: ['auth'] })

    const route = useRoute()

    const { data } = await useFetch(`/api/chat/${route.params.id}`, { key: `ai-chat-${route.params.id}` })

    if (!data.value) {
        throw createError({
            statusCode: 404,
            statusMessage: 'La conversación no existe.',
        })
    }

    const chat = new Chat({
        id: data.value.id,
        messages: data.value.messages as UIMessage[],
        onData(dataPart) {
            console.log(dataPart)
        },
        transport: new DefaultChatTransport({
            api: `/api/ai/${data.value.id}`,
            body: () => ({
                agentId: data.value?.agentId,
            }),
        }),
    })

    const { markClean, markDirty } = useLeavePrevent({
        async onConfirm() {
            await chat.stop()
        },
    })

    function onSubmit(parts: UIMessage['parts'], clean: () => void) {
        chat.sendMessage({ parts })
        clean()
    }

    watch(
        () => chat.status,
        (v) => {
            if (['streaming', 'submitted'].includes(v)) markDirty()
            else markClean()
        },
    )

    onMounted(() => {
        if (route.query.new === 'true' && data.value?.messages.length === 1) {
            chat.regenerate()
            navigateTo({ params: { id: route.params.id }, query: {} }, { replace: true })
            refreshNuxtData('dashboard-navigation')
        }
    })
</script>

<template>
    <UDashboardPanel :id="`ai-chat-${route.params.id}`">
        <template #body>
            <UContainer>
                <UChatMessages
                    class="py-6"
                    :messages="chat.messages"
                    shouldAutoScroll
                    :spacingOffset="80"
                    :status="['submitted', 'streaming'].includes(chat.status) ? 'submitted' : chat.status"
                >
                    <template #content="{ message }">
                        <div class="*:first:mt-0 *:last:mb-0">
                            <template
                                v-for="(part, index) in message.parts"
                                :key="`${message.id}-${part.type}-${index}${'state' in part ? `-${part.state}` : ''}`"
                            >
                                <ChatSkeletonText
                                    v-if="part.type === 'reasoning' && part.state === 'streaming'"
                                    text="Razonando..."
                                />
                                <MDCCached
                                    v-else-if="part.type === 'text'"
                                    :cacheKey="`${message.id}-${index}`"
                                    class="*:first:mt-0 *:last:mb-0"
                                    :parserOptions="{ highlight: false }"
                                    :value="part.text"
                                />
                                <ConversationAttachment
                                    v-else-if="part.type === 'file'"
                                    :alt="part.mediaType"
                                    :url="part.url"
                                />
                                <ChatToolGenerateImage
                                    v-else-if="part.type === AI_TOOL.GENERATE_IMAGE"
                                    :part="part"
                                />
                            </template>
                        </div>
                    </template>
                </UChatMessages>
            </UContainer>
        </template>
        <template #footer>
            <UContainer class="pb-4 sm:pb-6">
                <ChatForm
                    :chat="chat"
                    :hideModel="typeof data?.agentId === 'string'"
                    :status="chat.status"
                    @submit="onSubmit"
                />
            </UContainer>
        </template>
    </UDashboardPanel>
</template>
