<script setup lang="ts">
    interface Emit {
        (e: 'update', id: string): void
    }

    interface Props {
        active: boolean
        endpoint: string
        id: string
        name: string
    }

    const props = withDefaults(defineProps<Props>(), {})

    const emit = defineEmits<Emit>()

    async function onUpdate(value: boolean) {
        await $fetch(`${props.endpoint}/${props.id}`, {
            body: { active: value },
            method: 'PATCH',
        })
        await refreshNuxtData(props.name)
        emit('update', props.id)
    }
</script>

<template>
    <USwitch
        class="inline-flex"
        :modelValue="props.active"
        @update:modelValue="onUpdate"
    />
</template>
