<script setup lang="ts">
    interface Props {
        output: unknown
        state: string
    }

    const props = withDefaults(defineProps<Props>(), {})

    const imagesData = ref<{ height: number; isLoading: boolean; url: string; width: number }[]>([])
    const images = computed(() => props.output as { url: string }[])
    const currentImageUrl = ref<null | string>(null)

    watch(
        () => props.output,
        (newOutput) => {
            const outputImages = newOutput as { url: string }[]
            imagesData.value = outputImages.map((img) => ({
                height: 0,
                isLoading: true,
                url: img.url,
                width: 0,
            }))
        },
        { immediate: true }
    )

    const openImageInModal = (url: string) => {
        currentImageUrl.value = url
    }

    const closeModal = () => {
        currentImageUrl.value = null
    }

    const handleImageLoad = (index: number, event: Event) => {
        const img = event.target as HTMLImageElement
        imagesData.value[index] = {
            height: img.naturalHeight,
            isLoading: false,
            url: img.src,
            width: img.naturalWidth,
        }
    }
</script>

<template>
    <UModal :open="!!currentImageUrl">
        <template #header>
            <div class="flex justify-between items-center w-full">
                <h3 class="text-lg font-medium leading-6">Preview de imagen</h3>
                <UButton
                    color="neutral"
                    icon="i-lucide-x"
                    variant="ghost"
                    @click="closeModal"
                />
            </div>
        </template>
        <template #body>
            <img
                alt="Image Preview"
                class="w-full h-auto"
                :src="currentImageUrl!"
            />
        </template>
    </UModal>
    <div
        v-if="state === 'output-available'"
        class="mb-4"
    >
        <img
            v-for="value in imagesData"
            :key="value.url"
            alt="Generated Image"
            class="size-40 cursor-pointer"
            :src="value.url"
            @click="openImageInModal(value.url)"
            @load="handleImageLoad(imagesData.indexOf(value), $event)"
        />
    </div>
</template>
