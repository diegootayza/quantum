<script setup lang="ts">
    import { useImage } from '@vueuse/core'

    interface Emit {
        (e: 'delete', data: IFileSchema): void
    }

    interface Props {
        file: IFileSchema
    }

    const props = withDefaults(defineProps<Props>(), {})

    const emit = defineEmits<Emit>()

    const { isLoading, isReady } = useImage({ src: props.file.url })

    const open = ref(false)

    function deleteImage(currentFile: IFileSchema) {
        emit('delete', currentFile)
    }

    function openModal() {
        open.value = true
    }
</script>

<template>
    <div class="flex items-center justify-center relative overflow-hidden">
        <UIcon
            v-if="isLoading"
            class="size-10 animate-spin"
            name="lucide:loader-circle"
        />
        <template v-else-if="isReady">
            <img
                alt="Image"
                class="block object-contain size-full"
                :src="props.file.url"
            />
            <div class="absolute inset-0 flex items-center justify-center gap-2 bg-default/80 opacity-0 hover:opacity-100 transition-opacity">
                <UButton
                    icon="lucide:eye"
                    variant="soft"
                    @click="openModal"
                />
                <UButton
                    color="error"
                    icon="lucide:trash"
                    variant="soft"
                    @click="deleteImage(props.file)"
                />
            </div>
            <UModal
                v-model:open="open"
                :description="`Tamaño: 1MB`"
                title="Previsualización"
            >
                <template #body>
                    <img
                        alt="Image"
                        class="block object-contain size-full"
                        :src="props.file.url"
                    />
                </template>
            </UModal>
        </template>
    </div>
</template>
