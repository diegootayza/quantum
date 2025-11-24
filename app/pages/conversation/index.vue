<script setup lang="ts">
    definePageMeta({ layout: 'dashboard', middleware: 'auth' })

    const router = useRouter()

    const input = ref('')
    const loading = ref(false)

    async function createConversation(prompt: string) {
        input.value = prompt
        loading.value = true

        const response = await $fetch('/api/conversation', {
            body: { prompt },
            method: 'POST',
        })

        await refreshNuxtData('dashboard-navigation')

        router.push({ name: 'conversation-id', params: { id: response.conversationId } })
    }

    async function onSubmit() {
        await createConversation(input.value)
        input.value = ''
    }
</script>

<template>
    <UDashboardPanel
        id="conversation"
        :ui="{ body: 'p-0 sm:p-0' }"
    >
        <template #header>
            <UDashboardNavbar
                class="sticky lg:absolute top-0 inset-x-0 border-b-0 z-10 bg-default/75 backdrop-blur lg:bg-transparent lg:backdrop-blur-none pointer-events-none"
                :ui="{ left: 'pointer-events-auto', right: 'pointer-events-auto' }"
            />
        </template>

        <template #body>
            <UContainer class="flex-1 flex flex-col justify-center gap-4 sm:gap-6 py-8">
                <h1 class="text-3xl sm:text-4xl text-center text-highlighted font-bold">¿En que estas trabajando?</h1>

                <UChatPrompt
                    v-model="input"
                    class="[view-transition-name:chat-prompt]"
                    :status="loading ? 'streaming' : 'ready'"
                    variant="subtle"
                    @submit="onSubmit"
                >
                    <UChatPromptSubmit color="neutral" />
                </UChatPrompt>
            </UContainer>
        </template>
    </UDashboardPanel>
</template>
