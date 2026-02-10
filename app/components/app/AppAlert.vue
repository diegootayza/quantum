<script setup lang="ts">
    const { close, confirm, isOpen, loading, options } = useConfirmModal()
</script>

<template>
    <UModal
        v-model:open="isOpen"
        :description="options?.description"
        :title="options?.title"
        :ui="{ footer: 'justify-end', description: 'mt-4' }"
        @update:modelValue="(value: boolean) => !value && close()"
    >
        <template #footer="{ close: closeModal }">
            <UButton
                color="neutral"
                label="Cancelar"
                size="lg"
                variant="ghost"
                @click="closeModal"
            />
            <UButton
                color="primary"
                :label="options?.confirmButtonLabel || 'Enviar'"
                :loading="loading"
                size="lg"
                variant="soft"
                @click="confirm()"
            />
        </template>
    </UModal>
</template>
