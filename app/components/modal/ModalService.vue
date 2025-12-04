<script setup lang="ts">
    interface Emit {
        (e: 'refresh'): void
    }

    const emit = defineEmits<Emit>()
</script>

<template>
    <DashboardForm
        ref="DashboardForm"
        name="dashboard-service"
        :schema="serviceSchema"
        title="Servicio"
        url="/api/dashboard/service"
        @refresh="emit('refresh')"
    >
        <template #default="{ state }">
            <UFormField
                label="Nombre"
                name="name"
            >
                <UInput
                    v-model="state.name"
                    class="w-full"
                />
            </UFormField>

            <UFormField
                label="Descripción"
                name="description"
            >
                <UTextarea
                    v-model="state.description"
                    class="w-full"
                />
            </UFormField>
        </template>
    </DashboardForm>
</template>
