<script setup lang="ts">
    interface Props {
        output: unknown
        state: string
    }

    const props = withDefaults(defineProps<Props>(), {})

    const { open } = useImageModal()

    const images = computed(() => props.output as string[])

    function openModal(url: string) {
        open({
            alt: 'Imagen generada',
            url,
        })
    }
</script>

<template>
    <div
        v-if="state === 'output-available'"
        class="mb-4 flex gap-4"
    >
        <img
            v-for="image in images"
            :key="image"
            alt="Imagen generada"
            class="size-40 cursor-pointer rounded-lg hover:opacity-80 transition-opacity object-cover"
            :src="image"
            @click="openModal(image)"
        />
    </div>
</template>
