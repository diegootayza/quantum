<script setup lang="ts">
    definePageMeta({ layout: 'dashboard', middleware: ['auth', 'active'] })

    const route = useRoute()
    const router = useRouter()
    const { model } = useModels()

    const files = ref<File[]>([])
    const input = ref('')
    const instruction = ref<{ description: string; id: string; name: string } | null>(null)
    const instructionId = ref<string>()
    const loading = ref(false)

    async function createConversation(prompt: string) {
        input.value = prompt
        loading.value = true

        const formData = new FormData()

        formData.append('prompt', prompt)

        if (instructionId.value) formData.append('instructionId', instructionId.value)

        for (const file of files.value) {
            formData.append('files', file)
        }

        const response = await $fetch('/api/conversation', {
            body: formData,
            method: 'POST',
        })

        router.push({
            name: 'conversation-id',
            params: { id: response.conversationId },
        })
    }

    function onFilePush(newFiles: File[]) {
        files.value?.push(...newFiles)
    }

    async function onSubmit() {
        await createConversation(input.value)
        input.value = ''
    }

    watch(
        () => route.query,
        async (v) => {
            if (typeof v.id === 'string') {
                const response = await $fetch(`/api/instruction/${v.id}`, { method: 'GET' })

                instruction.value = response
                instructionId.value = v.id
            } else {
                instruction.value = null
                instructionId.value = undefined
            }
        },
        { immediate: true }
    )
</script>

<template>
    <UDashboardPanel
        id="conversation"
        :ui="{ body: 'p-0 sm:p-0' }"
    >
        <template #body>
            <UContainer class="flex-1 flex flex-col justify-center gap-4 sm:gap-6 py-8">
                <h1 class="text-3xl sm:text-4xl text-center text-highlighted font-bold">{{ instruction?.name || '¿En que estas trabajando?' }}</h1>

                <UChatPrompt
                    v-model="input"
                    class="[view-transition-name:chat-prompt]"
                    :status="loading ? 'streaming' : 'ready'"
                    variant="subtle"
                    @submit="onSubmit"
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
                                variant="ghost"
                            />
                        </div>
                    </template>
                </UChatPrompt>
            </UContainer>
        </template>
    </UDashboardPanel>
</template>
