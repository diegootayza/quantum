<script setup lang="ts">
    const { close, confirm, isOpen, loading, options } = useInputModal()

    const inputValue = ref('')

    // Actualizar el valor cuando se abre el modal con un valor inicial
    watch(
        () => options.value?.initialValue,
        (newValue) => {
            if (newValue !== undefined) {
                inputValue.value = newValue
            }
        },
        { immediate: true }
    )

    // Reiniciar el input cuando se cierra el modal
    watch(isOpen, (newValue) => {
        if (!newValue) {
            inputValue.value = ''
        } else if (options.value?.initialValue) {
            inputValue.value = options.value.initialValue
        }
    })

    const handleConfirm = () => {
        confirm(inputValue.value)
    }
</script>

<template>
    <UModal
        v-model:open="isOpen"
        :title="options?.title"
        :ui="{ footer: 'justify-end p-2 pt-0', body: 'border-none' }"
        @update:modelValue="(value: boolean) => !value && close()"
    >
        <template #body>
            <UInput
                v-model="inputValue"
                class="w-full"
                :placeholder="options?.placeholder"
                size="lg"
                @keydown.enter="handleConfirm"
            />
        </template>

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
                :label="options?.confirmButtonLabel || 'Confirmar'"
                :loading="loading"
                size="lg"
                variant="soft"
                @click="handleConfirm"
            />
        </template>
    </UModal>
</template>
