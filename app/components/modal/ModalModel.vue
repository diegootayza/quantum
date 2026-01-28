<script setup lang="ts">
    interface Emit {
        (e: 'refresh'): void
    }

    const emit = defineEmits<Emit>()
</script>

<template>
    <DashboardForm
        name="dashboard-model"
        :schema="modelSchema"
        title="Modelo"
        url="/api/model"
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
                label="Valor"
                name="value"
            >
                <UInput
                    v-model="state.value"
                    class="w-full"
                />
            </UFormField>
            <UFormField
                label="Roles"
                name="roles"
            >
                <USelectMenu
                    v-model="state.roles"
                    class="w-full"
                    :items="[
                        { label: 'Administrador', value: 'ADMIN' },
                        { label: 'Usuario', value: 'USER' },
                    ]"
                    labelKey="label"
                    multiple
                    valueKey="value"
                />
            </UFormField>
        </template>
    </DashboardForm>
</template>
