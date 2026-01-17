<script setup lang="ts">
    interface Props {
        devices: number
    }

    const props = withDefaults(defineProps<Props>(), {})
</script>

<template>
    <ClientOnly>
        <UBadge
            :color="props.devices ? 'success' : 'error'"
            :label="props.devices ? `${props.devices} ${props.devices === 1 ? 'dispositivo' : 'dispositivos'}` : 'Desconectado'"
        />
        <template #fallback> Desconectado </template>
    </ClientOnly>
</template>
