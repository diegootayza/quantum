<script setup lang="ts">
    interface Props {
        row: any
    }

    const props = withDefaults(defineProps<Props>(), {})

    async function onUpdate(value: boolean) {
        await $fetch(`/api/dashboard/user/${props.row.id}`, {
            body: { active: value },
            method: 'PATCH',
        })
        await refreshNuxtData('dashboard-user')
    }
</script>

<template>
    <USwitch
        :modelValue="props.row.active"
        @update:modelValue="onUpdate"
    />
</template>
