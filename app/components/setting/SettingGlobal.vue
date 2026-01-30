<script setup lang="ts">
    import { z } from 'zod'
    interface Props {}

    const props = withDefaults(defineProps<Props>(), {})

    const schema = z.object({
        namespace: z.string().min(1, 'El namespace debe tener al menos 1 carácter'),
        value: z.object({
            modelImage: z.string().min(1, 'La imagen del modelo es obligatoria'),
            modelText: z.string().min(1, 'El texto del modelo es obligatorio'),
            prompt: z.string().min(1, 'El prompt es obligatorio'),
        }),
    })
</script>

<template>
    <FormSetting
        namespace="ai"
        :schema="schema"
    >
        <UCard variant="outline">
            <template #header>
                <h2>IA</h2>
            </template>

            <UCard variant="soft">
                <div class="w-full grid grid-cols-1 gap-4">
                    <div class="w-full grid grid-cols-2 gap-4">
                        <FieldModelText
                            label="Modelo de texto por defecto"
                            name="value.modelText"
                        />
                        <FieldModelImage
                            label="Modelo de imagen por defecto"
                            name="value.modelImage"
                        />
                    </div>
                    <FieldTextarea
                        label="Prompt por defecto"
                        name="value.prompt"
                    />
                </div>
            </UCard>

            <template #footer>
                <div>
                    <UButton
                        color="primary"
                        label="Guardar"
                        type="submit"
                        variant="solid"
                    />
                </div>
            </template>
        </UCard>
    </FormSetting>
</template>
