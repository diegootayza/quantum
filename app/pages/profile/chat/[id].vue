<script setup lang="ts">
    import type { UIMessage } from 'ai'

    import { Chat } from '@ai-sdk/vue'
    import { DefaultChatTransport } from 'ai'

    definePageMeta({ key: (route) => generateKey(PAGE_NAME.PROFILE_CHAT_ID, String(route.params.id)), layout: 'dashboard', middleware: ['auth'] })

    const route = useRoute()
    const config = useRuntimeConfig()
    const axios = useAxios()
    const { accessToken } = useData()

    const key = computed(() => {
        return generateKey(PAGE_NAME.PROFILE_CHAT_ID, String(route.params.id))
    })

    const { data } = await useApiAsyncData(key.value, () => {
        return axios.get<{ messages: API.ChatMessage[] } & API.Chat>(`${API_ENDPOINT.CHAT_READ}/${route.params.id}`, {
            params: {
                messages: true,
            },
        })
    })

    useSeoMeta({
        title: () => data.value?.name || 'Chat AI',
    })

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
            api: `${config.public.connectUrl}/api/ai/chat/${data.value.id}`,
            body: () => ({
                agentId: data.value?.agentId,
            }),
            headers: {
                Authorization: `Bearer ${accessToken.value}`,
            },
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
            refreshNuxtData(API_ENDPOINT.PROFILE_NAVIGATION)
        }
    })
</script>

<template>
    <UDashboardPanel :id="key">
        <template #header>
            <UDashboardNavbar :title="data?.name || 'Chat AI'">
                <template #leading>
                    <UDashboardSidebarCollapse />
                </template>
            </UDashboardNavbar>
        </template>
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
                                <ChatToolFetchUrl
                                    v-else-if="part.type === AI_TOOL.FETCH_URL"
                                    :part="part"
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
