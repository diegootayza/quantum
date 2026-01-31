<script setup lang="ts">
    interface Props {
        text: string
    }

    const props = withDefaults(defineProps<Props>(), {})
</script>

<template>
    <span class="inline-block animate-pulse">{{ props.text }}</span>
</template>
