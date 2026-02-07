<script setup lang="ts">
    import { useImage } from '@vueuse/core'

    interface Emit {
        (e: 'delete'): void
    }

    interface Props {
        showDelete?: boolean
        size?: number
        src: string
    }

    const props = withDefaults(defineProps<Props>(), {
        showDelete: false,
        size: 0,
    })

    const emit = defineEmits<Emit>()

    const { isLoading, isReady } = useImage({ src: props.src })

    const open = ref(false)

    const size = computed(() => formatFileSize(props.size))

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
                :src="props.src"
            />
            <div class="absolute inset-0 flex items-center justify-center gap-2 bg-default/80 opacity-0 hover:opacity-100 transition-opacity">
                <UButton
                    icon="lucide:eye"
                    variant="soft"
                    @click="openModal"
                />
                <UButton
                    v-if="props.showDelete"
                    color="error"
                    icon="lucide:trash"
                    variant="soft"
                    @click="emit('delete')"
                />
            </div>
            <UModal
                v-model:open="open"
                :description="`Tamaño: ${size}`"
                title="Previsualización"
            >
                <template #body>
                    <img
                        alt="Image"
                        class="block object-contain size-full"
                        :src="props.src"
                    />
                </template>
            </UModal>
        </template>
    </div>
</template>
