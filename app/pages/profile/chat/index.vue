<script setup lang="ts">
    import type { ChatStatus, UIMessage } from 'ai'

    definePageMeta({ layout: 'dashboard', middleware: ['auth'] })

    useSeoMeta({
        title: 'Nuevo chat',
    })

    const axios = useAxios()

    const status = ref<ChatStatus>('ready')

    const { markClean, markDirty } = useLeavePrevent({
        onConfirm() {
            console.log('confirm')
        },
    })

    async function onSubmit(parts: UIMessage['parts'], clean: () => void) {
        status.value = 'submitted'
        clean()

        const id = await safeExecute(async () => {
            const { data } = await axios.post<string>(API_ENDPOINT.AI_CHAT_CREATE, { parts })
            return data
        })

        status.value = 'ready'
        if (id) navigateTo({ name: PAGE_NAME.PROFILE_CHAT_ID, params: { id }, query: { new: 'true' } })
    }

    watch(status, (v) => {
        if (['streaming', 'submitted'].includes(v)) markDirty()
        else markClean()
    })
</script>

<template>
    <UDashboardPanel id="chat">
        <template #header>
            <UDashboardNavbar title="Nuevo chat">
                <template #leading>
                    <UDashboardSidebarCollapse />
                </template>
            </UDashboardNavbar>
        </template>
        <template #body>
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
        </template>
    </UDashboardPanel>
</template>
