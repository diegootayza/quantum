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
                label="Archivo"
                name="files"
            >
                <UFileUpload
                    v-model="(state as any).files"
                    class="w-full"
                    multiple
                />
            </UFormField>

            <div
                v-if="Array.isArray((state as any).existingFiles) && (state as any).existingFiles.length"
                class="space-y-2"
            >
                <p class="text-sm text-muted">Archivos actuales</p>
                <ul class="space-y-1">
                    <li
                        v-for="f in (state as any).existingFiles"
                        :key="f.id"
                        class="text-sm"
                    >
                        <a
                            v-if="f.url"
                            class="underline"
                            :href="`https://quantum-click-b3zsw7g71oh7zinn9zdihygpu5b14use2a-s3alias/${f.key}`"
                            rel="noopener noreferrer"
                            target="_blank"
                        >
                            {{ f.key }}
                        </a>
                        <span v-else>{{ f.key }}</span>
                    </li>
                </ul>
            </div>
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
