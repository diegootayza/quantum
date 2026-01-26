<script setup lang="ts">
    interface Emit {
        (e: 'refresh'): void
    }

    const emit = defineEmits<Emit>()
</script>

<template>
    <DashboardForm
        :isFormData="true"
        name="dashboard-instruction"
        :schema="instructionSchema"
        title="Instrucción"
        url="/api/instruction/dashboard"
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
                <UInput
                    v-model="state.description"
                    class="w-full"
                />
            </UFormField>
            <UFormField
                label="Contenido"
                name="content"
            >
                <UTextarea
                    v-model="state.content"
                    autoresize
                    class="w-full"
                />
            </UFormField>
        </template>
    </DashboardForm>
</template>
