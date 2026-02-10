<script setup lang="ts">
    interface Props {
        value: string
        values: string[]
    }

    const props = withDefaults(defineProps<Props>(), {})

    const displayValue = computed(() => {
        const found = props.values.find((v) => v.split(':')[0] === props.value)
        return found ? found.split(':')[1] : props.value
    })
</script>

<template>
    <div>
        <pre>{{ displayValue }}</pre>
    </div>
</template>
