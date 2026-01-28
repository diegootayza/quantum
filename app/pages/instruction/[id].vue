<script setup lang="ts">
    import type { UIMessage } from 'ai'

    definePageMeta({ layout: 'dashboard', middleware: ['auth'] })

    const route = useRoute()

    const { data, error } = await useFetch(`/api/chat-agent/${route.params.id}`)

    if (error.value) {
        throw createError({
            statusCode: error.value.statusCode || 500,
            statusMessage: error.value.statusMessage || 'Error fetching instruction data.',
        })
    }

    async function onSubmit(parts: UIMessage['parts'], clean: () => void) {
        const response = await $fetch('/api/ai', {
            body: {
                instructionId: route.params.id,
                parts,
            },
            method: 'POST',
        })

        console.log(response)

        clean()
    }
</script>

<template>
    <UDashboardPanel id="instruction-id">
        <div class="flex-1 flex flex-col gap-8 p-4 items-center justify-center">
            <div class="flex flex-col items-center justify-center gap-4 w-full">
                <h1 class="text-3xl sm:text-4xl text-center text-highlighted font-bold">{{ data?.name }}</h1>
                <p class="text-center text-base text-muted-foreground">{{ data?.description }}</p>
            </div>
            <div class="w-full max-w-6xl">
                <ChatForm
                    hideModel
                    @submit="onSubmit"
                />
            </div>
        </div>
    </UDashboardPanel>
</template>
