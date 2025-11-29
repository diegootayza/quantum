<script setup lang="ts">
    interface Props {
        output: unknown
        state: string
    }

    const props = withDefaults(defineProps<Props>(), {})

    const src = computed(() => props.output as string)
</script>

<template>
    <div class="mb-4">
        <img
            v-if="state === 'output-available'"
            alt="Generated Image"
            class="size-40"
            :src="src"
        />
    </div>
</template>
