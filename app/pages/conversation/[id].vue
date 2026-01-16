<script setup lang="ts">
    import type { UIMessage } from 'ai'
    import type { DefineComponent } from 'vue'

    import { Chat } from '@ai-sdk/vue'
    import { getTextFromMessage } from '@nuxt/ui/utils/ai'
    import { useClipboard } from '@vueuse/core'
    import { DefaultChatTransport } from 'ai'

    definePageMeta({ layout: 'dashboard', middleware: ['auth', 'active'] })

    useSeoMeta({
        description: 'Continúa tu conversación con IA',
        title: 'Conversación',
    })

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
        throw createError({ fatal: true, statusCode: 404, statusMessage: 'La conversación no existe.' })
    }

    const input = ref('')
    const files = ref<File[]>([])

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

    async function handleSubmit(e: Event) {
        e.preventDefault()
        if (input.value.trim()) {
            const uploadedFiles = await processFiles()

            chat.sendMessage({
                files: uploadedFiles.length > 0 ? uploadedFiles : undefined,
                text: input.value,
            })

            files.value = []
            input.value = ''
        }
    }

    async function processFiles() {
        if (import.meta.browser) {
            if (files.value.length === 0) return []
            const formData = new FormData()

            if (data.value) formData.append('conversationId', data.value.id)

            for (const file of files.value) {
                if (file) formData.append('files', file)
            }

            const response = await $fetch('/api/attachment', {
                body: formData,
                method: 'POST',
            })

            return response
        } else {
            return []
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

    function onFilePush(newFiles: File[]) {
        files.value?.push(...newFiles)
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
                                <img
                                    v-else-if="part.type === 'file'"
                                    :alt="part.mediaType"
                                    class="h-40"
                                    :src="part.url"
                                />
                                <ConversationImage
                                    v-else-if="part.type === 'tool-generateImage'"
                                    :output="part.output"
                                    :state="part.state"
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
                    <template #header>
                        <ConversationFilePreview v-model="files" />
                    </template>

                    <template #footer>
                        <div class="flex items-center justify-start gap-2">
                            <ConversationFile @push="onFilePush" />
                            <SelectModel v-model="model" />
                        </div>
                        <div class="flex items-center justify-end gap-2">
                            <ConversationSpeech v-model="input" />
                            <UChatPromptSubmit
                                color="neutral"
                                :status="chat.status"
                                variant="ghost"
                                @reload="chat.regenerate()"
                                @stop="chat.stop()"
                            />
                        </div>
                    </template>
                </UChatPrompt>
            </UContainer>
        </template>
    </UDashboardPanel>
</template>
