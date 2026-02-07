<script setup lang="ts">
    interface Emit {
        (e: 'files', data: ({ url: string } & API.File)[]): void
    }

    const emit = defineEmits<Emit>()

    const { user } = useData()
    const apiFile = useApiFile()

    const inputRef = useTemplateRef('input')

    const loading = ref(false)

    async function onChange(e: Event) {
        const input = e.target as HTMLInputElement
        const files = input.files ? Array.from(input.files) : []

        loading.value = true

        if (user.value) {
            const items = await apiFile.createMany({ files, path: `users/${user.value.id}/uploads`, type: 'upload', userId: user.value.id })
            if (items) emit('files', items)
        }

        loading.value = false
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
            icon="lucide:plus"
            :loading="loading"
            variant="ghost"
            @click="openFileDialog"
        />
    </div>
</template>
