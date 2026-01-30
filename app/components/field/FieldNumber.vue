<script setup lang="ts">
    interface Props {
        label: string
        name: string
    }

    const props = withDefaults(defineProps<Props>(), {})

    const { errorMessage, value } = useField<number>(props.name)
</script>

<template>
    <FieldWrapper
        :errorMessage="errorMessage"
        :label="props.label"
    >
        <template #default="{ id }">
            <UInput
                :id="id"
                v-model="value"
                class="w-full"
                type="number"
            />
        </template>
    </FieldWrapper>
</template>
