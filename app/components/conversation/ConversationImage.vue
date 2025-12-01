<script setup lang="ts">
    interface Props {
        output: unknown
        state: string
    }

    const props = withDefaults(defineProps<Props>(), {})

    const images = computed(() => props.output as { url: string }[])
</script>

<template>
    <div
        v-if="state === 'output-available'"
        class="mb-4"
    >
        <img
            v-for="value in images"
            :key="value.url"
            alt="Generated Image"
            class="size-40"
            :src="value.url"
        />
    </div>
</template>
