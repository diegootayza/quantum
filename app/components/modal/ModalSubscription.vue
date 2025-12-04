<script setup lang="ts">
    interface Emit {
        (e: 'refresh'): void
    }

    const emit = defineEmits<Emit>()

    const { data: services } = await useFetch('/api/dashboard/service')
</script>

<template>
    <DashboardForm
        ref="DashboardForm"
        name="dashboard-subscription"
        :schema="subscriptionSchema"
        title="Suscripción"
        url="/api/dashboard/subscription"
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

            <div class="grid grid-cols-2 gap-4">
                <UFormField
                    label="Precio"
                    name="price"
                >
                    <UInput
                        v-model.number="state.price"
                        type="number"
                        class="w-full"
                    />
                </UFormField>

                <UFormField
                    label="Moneda"
                    name="currency"
                >
                    <UInput
                        v-model="state.currency"
                        class="w-full"
                    />
                </UFormField>
            </div>

            <UFormField
                label="Intervalo"
                name="interval"
            >
                <USelect
                    v-model="state.interval"
                    :items="['MONTHLY', 'YEARLY']"
                    class="w-full"
                />
            </UFormField>

            <!-- Features handling could be more complex, for now simple text input or we can improve it later -->
             <UFormField
                label="Características (separadas por coma)"
                name="features"
            >
                <UTextarea
                    :model-value="state.features?.join(', ')"
                    @update:model-value="(val) => state.features = val.split(',').map(s => s.trim()).filter(Boolean)"
                    class="w-full"
                    placeholder="Feature 1, Feature 2, Feature 3"
                />
            </UFormField>

            <UFormField
                label="Servicios"
                name="serviceIds"
            >
                <USelectMenu
                    v-model="state.serviceIds"
                    class="w-full"
                    :options="services"
                    option-attribute="name"
                    multiple
                    value-attribute="id"
                />
            </UFormField>

             <UFormField
                label="Stripe ID"
                name="stripeId"
            >
                <UInput
                    v-model="state.stripeId"
                    class="w-full"
                />
            </UFormField>
        </template>
    </DashboardForm>
</template>
