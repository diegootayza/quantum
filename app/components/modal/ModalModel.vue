<script setup lang="ts">
    interface Emit {
        (e: 'refresh'): void
    }

    const emit = defineEmits<Emit>()
</script>

<template>
    <DashboardForm
        ref="DashboardForm"
        name="dashboard-model"
        :schema="modelSchema"
        title="Modelo"
        url="/api/model"
        @refresh="emit('refresh')"
    >
        <template #default="{ state }">
            <UFormField
                label="Nombre"
                name="label"
            >
                <UInput
                    v-model="state.label"
                    class="w-full"
                />
            </UFormField>

            <UFormField
                label="Valor"
                name="value"
            >
                <UInput
                    v-model="state.value"
                    class="w-full"
                />
            </UFormField>
        </template>
    </DashboardForm>
</template>
