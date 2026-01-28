<script setup lang="ts">
    import type { UIMessage } from 'ai'
    import type { DefineComponent } from 'vue'

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

    const ConversationProse = resolveComponent('ConversationProse')

    const components = {
        pre: ConversationProse as unknown as DefineComponent,
    }

    const chat = new Chat({
        id: data.value.id,
        messages: data.value.messages as UIMessage[],
        transport: new DefaultChatTransport({
            api: `/api/ai/${data.value.id}`,
            body: () => ({
                agentId: data.value?.agentId,
            }),
        }),
    })

    function onSubmit(parts: UIMessage['parts'], clean: () => void) {
        chat.sendMessage({ parts })
        clean()
    }

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
                                <MDCCached
                                    v-if="part.type === 'text'"
                                    :cacheKey="`${message.id}-${index}`"
                                    class="*:first:mt-0 *:last:mb-0"
                                    :components="components"
                                    :parserOptions="{ highlight: false }"
                                    :value="part.text"
                                />
                                <ConversationAttachment
                                    v-else-if="part.type === 'file'"
                                    :alt="part.mediaType"
                                    :url="part.url"
                                />
                                <ConversationImage
                                    v-else-if="part.type === 'tool-generate-image'"
                                    :output="part.output"
                                    :state="part.state"
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
