<script setup lang="ts">
    interface Emit {
        (e: 'refresh'): void
    }

    const emit = defineEmits<Emit>()

    const { data: subscriptions } = await useFetch('/api/dashboard/subscription')
    const { data: services } = await useFetch('/api/dashboard/service')
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
                <USelectMenu
                    v-model="state.role"
                    :options="['ADMIN', 'USER']"
                    class="w-full"
                />
            </UFormField>

            <UFormField
                label="Suscripción"
                name="subscriptionId"
            >
                <USelectMenu
                    v-model="state.subscriptionId"
                    :options="subscriptions"
                    option-attribute="name"
                    value-attribute="id"
                    class="w-full"
                />
            </UFormField>

            <UFormField
                label="Servicios Adicionales"
                name="serviceIds"
            >
                <USelectMenu
                    v-model="state.serviceIds"
                    :options="services"
                    option-attribute="name"
                    multiple
                    value-attribute="id"
                    class="w-full"
                />
            </UFormField>
        </template>
    </DashboardForm>
</template>
