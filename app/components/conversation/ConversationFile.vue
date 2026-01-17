<script setup lang="ts">
    interface Emit {
        (e: 'push', files: File[]): void
    }

    const emit = defineEmits<Emit>()

    const inputRef = useTemplateRef('input')

    function onChange(e: Event) {
        const input = e.target as HTMLInputElement
        const files = input.files ? Array.from(input.files) : []
        const images = files.filter(file => file.type.startsWith('image/'))
        emit('push', images)
        input.value = ''
    }

    function openFileDialog() {
        inputRef.value?.click()
    }
</script>

<template>
    <div>
        <input
            ref="input"
            accept="image/*"
            class="hidden"
            hidden
            multiple
            type="file"
            @change="onChange"
        />
        <UButton
            color="neutral"
            icon="lucide:upload"
            variant="ghost"
            @click="openFileDialog"
        />
    </div>
</template>
