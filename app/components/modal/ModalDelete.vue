<script setup lang="ts">
    interface Props {
        description: string
        title: string
    }

    const props = withDefaults(defineProps<Props>(), {})

    const open = defineModel('open', { default: false, type: Boolean })
</script>

<template>
    <UModal
        v-model:open="open"
        :description="description"
        :title="title"
    >
        <UButton
            icon="lucide:plus"
            label="Nuevo"
        />

        <template #body>
            <!--  -->
        </template>
        <template #footer>
            <div class="flex justify-end gap-2 w-full">
                <UButton
                    color="neutral"
                    label="Cancelar"
                    variant="subtle"
                />
                <UButton
                    color="primary"
                    label="Guardar"
                    variant="solid"
                />
            </div>
        </template>
    </UModal>
</template>
