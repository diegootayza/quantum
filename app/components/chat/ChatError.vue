<script setup lang="ts">
    interface Props {
        errorText?: string
    }

    const props = withDefaults(defineProps<Props>(), {
        errorText: undefined,
    })
</script>

<template>
    <UAlert
        v-if="props.errorText"
        color="error"
        icon="lucide:circle-x"
        :title="props.errorText"
        variant="subtle"
    />
</template>
