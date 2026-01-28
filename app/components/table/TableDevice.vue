<script setup lang="ts">
    interface Props {
        id: string
    }

    const props = withDefaults(defineProps<Props>(), {})

    const socket = useSocket()

    const devices = ref(0)

    onMounted(() => {
        socket?.emit('admin:user.devices', props.id)

        socket?.on(`admin:user.devices.${props.id}`, (data: number) => {
            devices.value = data
        })
    })
</script>

<template>
    <ClientOnly>
        <UBadge
            :color="devices ? 'success' : 'error'"
            :label="devices ? `${devices} ${devices === 1 ? 'dispositivo' : 'dispositivos'}` : 'Desconectado'"
        />
        <template #fallback>
            <UBadge
                color="error"
                label="Desconectado"
            />
        </template>
    </ClientOnly>
</template>
