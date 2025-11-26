<script setup lang="ts">
    definePageMeta({ layout: 'dashboard', middleware: 'auth' })

    const route = useRoute()
    const router = useRouter()
    const { model } = useModel()

    const input = ref('')
    const loading = ref(false)
    const instructionId = ref<string>()
    const instruction = ref<{ description: string; id: string; name: string } | null>(null)

    async function createConversation(prompt: string) {
        input.value = prompt
        loading.value = true

        const response = await $fetch('/api/conversation', {
            body: { instructionId: instructionId.value, prompt },
            method: 'POST',
        })

        await refreshNuxtData('dashboard-navigation')

        router.push({
            name: 'conversation-id',
            params: { id: response.conversationId },
        })
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
                    <UChatPromptSubmit color="neutral" />

                    <template #footer>
                        <SelectModel v-model="model" />
                    </template>
                </UChatPrompt>
            </UContainer>
        </template>
    </UDashboardPanel>
</template>
