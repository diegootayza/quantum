<script setup lang="ts">
    interface Emit {
        (e: 'refresh'): void
    }

    const emit = defineEmits<Emit>()
</script>

<template>
    <DashboardForm
        name="dashboard-chat-agent"
        :schema="chatAgentSchema"
        title="Agente"
        url="/api/chat-agent"
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
                    autoresize
                    class="w-full"
                />
            </UFormField>
            <UFormField
                label="Modelo"
                name="model"
            >
                <UInput
                    v-model="state.model"
                    class="w-full"
                />
            </UFormField>
            <UFormField
                label="Instrucción"
                name="instruction"
            >
                <UTextarea
                    v-model="state.instruction"
                    autoresize
                    class="w-full"
                />
            </UFormField>
        </template>
    </DashboardForm>
</template>
