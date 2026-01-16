<script setup lang="ts">
    interface Props {
        alt?: string
        url: string
    }

    const props = defineProps<Props>()

    const { open } = useImageModal()

    function openModal() {
        open({
            alt: props.alt,
            url: props.url,
        })
    }
</script>

<template>
    <img
        :alt="alt || 'Imagen adjunta'"
        class="h-40 cursor-pointer rounded-lg hover:opacity-80 transition-opacity"
        :src="url"
        @click="openModal"
    />
</template>
