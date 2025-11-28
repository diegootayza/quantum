<script setup lang="ts">
    import type { UIMessage } from 'ai'
    import type { DefineComponent } from 'vue'

    import { Chat } from '@ai-sdk/vue'
    import { getTextFromMessage } from '@nuxt/ui/utils/ai'
    import { useClipboard } from '@vueuse/core'
    import { DefaultChatTransport } from 'ai'

    definePageMeta({ layout: 'dashboard', middleware: 'auth' })

    const ConversationProse = resolveComponent('ConversationProse')

    const components = {
        pre: ConversationProse as unknown as DefineComponent,
    }

    const route = useRoute()
    const toast = useToast()
    const clipboard = useClipboard()
    const { model } = useModels()

    const { data, refresh } = await useFetch(`/api/conversation/${route.params.id}`, {
        cache: 'force-cache',
    })

    if (!data.value) {
        throw createError({ fatal: true, statusCode: 404, statusMessage: 'Chat not found' })
    }

    const input = ref('')

    const chat = new Chat({
        id: data.value.id,
        messages: data.value.messages as any[],
        onData: (dataPart) => {
            if (dataPart.type === 'data-chat-title') {
                refreshNuxtData('dashboard-navigation')
                refresh()
            }
        },
        onError(error) {
            const { message } = typeof error.message === 'string' && error.message[0] === '{' ? JSON.parse(error.message) : error
            toast.add({
                color: 'error',
                description: message,
                duration: 0,
                icon: 'i-lucide-alert-circle',
            })
        },
        transport: new DefaultChatTransport({
            api: `/api/conversation/${data.value.id}`,
            body: () => ({
                model: model.value,
            }),
        }),
    })

    function handleSubmit(e: Event) {
        e.preventDefault()
        if (input.value.trim()) {
            chat.sendMessage({
                text: input.value,
            })
            input.value = ''
        }
    }

    const copied = ref(false)

    function copy(e: MouseEvent, message: UIMessage) {
        clipboard.copy(getTextFromMessage(message))

        copied.value = true

        setTimeout(() => {
            copied.value = false
        }, 2000)
    }

    onMounted(() => {
        if (data.value?.messages.length === 1) {
            chat.regenerate()
        }
    })
</script>

<template>
    <UDashboardPanel
        id="chat"
        class="relative"
        :ui="{ body: 'p-0 sm:p-0' }"
    >
        <template #header>
            <UDashboardNavbar :title="data?.name || 'Nueva conversación'">
                <template #leading>
                    <UDashboardSidebarCollapse />
                </template>
            </UDashboardNavbar>
        </template>
        <template #body>
            <UContainer class="flex-1 flex flex-col gap-4 sm:gap-6">
                <UChatMessages
                    :assistant="chat.status !== 'streaming' ? { actions: [{ label: 'Copy', icon: copied ? 'i-lucide-copy-check' : 'i-lucide-copy', onClick: copy }] } : { actions: [] }"
                    class="lg:pt-(--ui-header-height) pb-4 sm:pb-6"
                    :messages="chat.messages"
                    shouldAutoScroll
                    :spacingOffset="160"
                    :status="chat.status"
                >
                    <template #content="{ message }">
                        <div class="*:first:mt-0 *:last:mb-0">
                            <template
                                v-for="(part, index) in message.parts"
                                :key="`${message.id}-${part.type}-${index}${'state' in part ? `-${part.state}` : ''}`"
                            >
                                <ConversationReasoning
                                    v-if="part.type === 'reasoning'"
                                    :isStreaming="part.state !== 'done'"
                                    :text="part.text"
                                />
                                <MDCCached
                                    v-else-if="part.type === 'text'"
                                    :cacheKey="`${message.id}-${index}`"
                                    class="*:first:mt-0 *:last:mb-0"
                                    :components="components"
                                    :parserOptions="{ highlight: false }"
                                    :value="part.text"
                                />
                            </template>
                        </div>
                    </template>
                </UChatMessages>

                <UChatPrompt
                    v-model="input"
                    class="sticky bottom-0 [view-transition-name:chat-prompt] rounded-b-none z-10"
                    :error="chat.error"
                    variant="subtle"
                    @submit="handleSubmit"
                >
                    <UChatPromptSubmit
                        color="neutral"
                        :status="chat.status"
                        @reload="chat.regenerate()"
                        @stop="chat.stop()"
                    />
                    <template #footer>
                        <div class="flex items-center justify-start gap-2">
                            <UTooltip text="Adjuntar archivos">
                                <UButton
                                    class="hover:bg-default focus:bg-default"
                                    color="neutral"
                                    icon="i-lucide-paperclip"
                                    variant="ghost"
                                />
                            </UTooltip>
                            <SelectModel v-model="model" />
                        </div>
                    </template>
                </UChatPrompt>
            </UContainer>
        </template>
    </UDashboardPanel>
</template>
