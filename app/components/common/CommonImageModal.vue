<script setup lang="ts">
    const { close, isOpen, options } = useImageModal()

    async function download() {
        if (!options.value?.url) return

        try {
            const response = await fetch(options.value.url)
            const blob = await response.blob()
            const url = URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = options.value.alt || 'imagen'
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            URL.revokeObjectURL(url)
        } catch (error) {
            console.error('Error downloading image:', error)
        }
    }
</script>

<template>
    <UModal
        v-model:open="isOpen"
        :ui="{ content: 'sm:max-w-4xl' }"
        @update:open="(value: boolean) => !value && close()"
    >
        <template #content>
            <div class="relative">
                <img
                    v-if="options?.url"
                    :alt="options?.alt || 'Imagen'"
                    class="w-full h-auto max-h-[80vh] object-contain"
                    :src="options.url"
                />
                <div class="absolute top-2 right-2 flex gap-2">
                    <UButton
                        color="neutral"
                        icon="i-lucide-download"
                        size="lg"
                        variant="solid"
                        @click="download"
                    />
                    <UButton
                        color="neutral"
                        icon="i-lucide-x"
                        size="lg"
                        variant="solid"
                        @click="close"
                    />
                </div>
            </div>
        </template>
    </UModal>
</template>
