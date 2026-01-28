<script setup lang="ts">
    interface Props {
        value: string | string[]
    }

    const props = withDefaults(defineProps<Props>(), {})

    const constants: Record<string, string> = {
        ADMIN: 'Administrador',
        USER: 'Usuario',
    }

    const displayValues = computed(() => {
        if (Array.isArray(props.value)) {
            return props.value.map((val) => constants[val] || val).join(', ')
        } else {
            return constants[props.value] || props.value
        }
    })
</script>

<template>
    <span>
        {{ displayValues }}
    </span>
</template>
