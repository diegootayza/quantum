<script setup lang="ts">
    interface Emit {
        (e: 'refresh'): void
    }

    const emit = defineEmits<Emit>()
</script>

<template>
    <DashboardForm
        ref="DashboardForm"
        name="dashboard-user"
        :schema="userSchema"
        title="Usuario"
        url="/api/dashboard/user"
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
                label="Apellido"
                name="surname"
            >
                <UInput
                    v-model="state.surname"
                    class="w-full"
                />
            </UFormField>
            <UFormField
                label="Correo electrónico"
                name="email"
            >
                <UInput
                    v-model="state.email"
                    class="w-full"
                />
            </UFormField>
            <UFormField
                label="Rol"
                name="role"
            >
                <UInput
                    v-model="state.role"
                    class="w-full"
                />
            </UFormField>
        </template>
    </DashboardForm>
</template>
