<script setup lang="ts">
    import { useImage } from '@vueuse/core'

    interface Props {
        src: string
    }

    const props = withDefaults(defineProps<Props>(), {})

    const { isLoading, isReady } = useImage({ src: props.src })

    const open = ref(false)

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
                        :src="props.src"
                    />
                </template>
            </UModal>
        </template>
    </div>
</template>
