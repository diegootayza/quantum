<script setup lang="ts">
    import type { Chat } from '@ai-sdk/vue'
    import type { ChatStatus, UIMessage } from 'ai'

    interface Emit {
        (e: 'submit', parts: UIMessage['parts'], clean: () => void): void
    }

    interface Props {
        chat?: Chat<UIMessage>
        hideModel?: boolean
        status?: ChatStatus
    }

    const props = withDefaults(defineProps<Props>(), {
        chat: undefined,
        hideModel: false,
        status: 'ready',
    })

    const emit = defineEmits<Emit>()

    const { fetcher } = useConnect()

    const files = ref<IFileSchema[]>([])
    const text = ref('')

    const parts = computed<UIMessage['parts']>(() => {
        const media: UIMessage['parts'] = files.value.map((file) => ({
            mediaType: file.mimeType,
            type: 'file',
            url: file.url,
        }))

        if (!text.value.trim().length) return media
        else return [...media, { text: text.value, type: 'text' }]
    })

    const { markClean, markDirty } = useLeavePrevent({
        async onConfirm() {
            for await (const file of files.value) {
                await fetcher(`api/file/${file.id}`, { method: 'DELETE' })
            }
        },
    })

    function onFiles(newFiles: IFileSchema[]) {
        files.value.push(...newFiles)
    }

    function onSubmit() {
        if (!parts.value.length) return

        emit('submit', parts.value, () => {
            text.value = ''
            files.value = []
        })
    }

    async function removeFile(currentFile: IFileSchema) {
        await fetcher(`api/file/${currentFile.id}`, { method: 'DELETE' })
        files.value = files.value.filter((file) => file.id !== currentFile.id)
    }

    watch(
        files,
        (v) => {
            if (v.length) markDirty()
            else markClean()
        },
        { deep: true },
    )
</script>

<template>
    <UChatPrompt
        v-model="text"
        class="[view-transition-name:chat-form]"
        :error="chat?.error"
        variant="subtle"
        @submit="onSubmit"
    >
        <template #header>
            <div
                v-if="files.length"
                class="w-full grid grid-cols-[repeat(auto-fill,minmax(80px,1fr))] gap-4 px-4"
            >
                <ClientOnly>
                    <CommonImage
                        v-for="file in files"
                        :key="file.id"
                        class="aspect-square w-full bg-default ring ring-accented rounded-md"
                        showDelete
                        :src="file.url"
                        @delete="removeFile(file)"
                    />
                </ClientOnly>
            </div>
        </template>

        <template #footer>
            <div class="flex items-center justify-start gap-2">
                <ChatFormFile @files="onFiles" />
                <ChatFormModel v-if="!props.hideModel" />
            </div>
            <div class="flex items-center justify-end gap-2">
                <UChatPromptSubmit
                    color="neutral"
                    :status="status"
                    variant="ghost"
                    @reload="chat?.regenerate()"
                    @stop="chat?.stop()"
                />
            </div>
        </template>
    </UChatPrompt>
</template>
