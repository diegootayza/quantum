<script setup lang="ts">
    interface Emit {
        (e: 'refresh'): void
    }

    const emit = defineEmits<Emit>()
</script>

<template>
    <DashboardForm
        ref="DashboardForm"
        name="dashboard-instruction"
        :schema="instructionSchema"
        title="Instrucción"
        url="/api/dashboard/instruction"
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
                label="Categoría"
                name="categoryId"
            >
                <SelectCategory
                    v-model="state.categoryId"
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
            <UFormField
                label="Archivo"
                name="file"
            >
                <UFileUpload
                    class="w-full"
                    multiple
                />
            </UFormField>
        </template>
    </DashboardForm>
</template>
