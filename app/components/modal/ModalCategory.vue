<script setup lang="ts">
    interface Emit {
        (e: 'refresh'): void
    }

    const emit = defineEmits<Emit>()
</script>

<template>
    <DashboardForm
        ref="DashboardForm"
        name="dashboard-category"
        :schema="categorySchema"
        title="Categoría"
        url="/api/dashboard/category"
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
        </template>
    </DashboardForm>
</template>
