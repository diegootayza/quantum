<script setup lang="ts">
    interface Props {
        id: string
    }

    const props = withDefaults(defineProps<Props>(), {})

    const store = useUsersStore()
    const { users } = storeToRefs(store)

    const devices = computed(() => {
        const userDevices = users.value[props.id] || []
        return userDevices.length
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
