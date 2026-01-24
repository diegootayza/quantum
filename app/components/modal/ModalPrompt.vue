<script setup lang="ts">
    interface Emit {
        (e: 'refresh'): void
    }

    const emit = defineEmits<Emit>()
</script>

<template>
    <DashboardForm
        ref="DashboardForm"
        name="dashboard-prompt"
        :schema="promptSchema"
        title="Prompt"
        url="/api/dashboard/prompt"
        @refresh="emit('refresh')"
    >
        <template #default="{ state }">
            <UFormField
                label="Descripción"
                name="description"
            >
                <UInput
                    v-model="state.description"
                    class="w-full"
                />
            </UFormField>
            <UFormField
                label="Clave"
                name="key"
            >
                <UInput
                    v-model="state.key"
                    class="w-full"
                />
            </UFormField>
            <UFormField
                label="Valor"
                name="value"
            >
                <UTextarea
                    v-model="state.value"
                    autoresize
                    class="w-full"
                />
            </UFormField>
        </template>
    </DashboardForm>
</template>
