<script setup lang="ts">
    useSeoMeta({
        description: 'Configuración de IA del sistema',
        title: 'IA - Configuración Admin',
    })
</script>

<template>
    <div class="w-full grid grid-cols-1 gap-4">
        <FormSetting
            name="prompt"
            namespace="ai"
            title="Prompt principal"
        >
            <template #default="{ state }">
                <UFormField name="value">
                    <UTextarea
                        v-model="state.value"
                        autoresize
                        class="w-full"
                    />
                </UFormField>
            </template>
        </FormSetting>
        <FormSetting
            name="title"
            namespace="ai"
            title="Prompt título"
        >
            <template #default="{ state }">
                <UFormField name="value">
                    <UTextarea
                        v-model="state.value"
                        autoresize
                        class="w-full"
                    />
                </UFormField>
            </template>
        </FormSetting>
    </div>
</template>
