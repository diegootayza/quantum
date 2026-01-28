<script setup lang="ts">
    interface Emit {
        (e: 'files', data: IFileSchema[]): void
    }

    const emit = defineEmits<Emit>()

    const { user } = useUserSession()
    const { fetcher } = useConnect()

    const inputRef = useTemplateRef('input')

    const loading = ref(false)

    async function onChange(e: Event) {
        const input = e.target as HTMLInputElement
        const files = input.files ? Array.from(input.files) : []

        loading.value = true

        try {
            const formData = new FormData()

            if (user.value) {
                formData.append('path', `users/${user.value.id}/uploads`)
                formData.append('type', 'upload')
                formData.append('userId', user.value.id)

                files.forEach((file) => {
                    formData.append('files', file)
                })

                const data = await fetcher<IFileSchema[]>('api/file', {
                    body: formData,
                    method: 'POST',
                })

                emit('files', data)
            }
        } catch {
            //
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
