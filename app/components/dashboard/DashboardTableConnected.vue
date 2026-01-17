<script setup lang="ts">
    interface Props {
        id: string
    }

    const props = withDefaults(defineProps<Props>(), {})

    const store = useUsersStore()
    const { users } = storeToRefs(store)

    const current = computed(() => users.value[props.id])
</script>

<template>
    <ClientOnly>
        <UBadge
            :color="current?.length ? 'success' : 'error'"
            :label="current?.length ? `${current?.length} ${current?.length === 1 ? 'dispositivo' : 'dispositivos'}` : 'Desconectado'"
        />
        <template #fallback>
            <UBadge
                color="error"
                label="Desconectado"
            />
        </template>
    </ClientOnly>
</template>
