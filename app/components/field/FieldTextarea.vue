<script setup lang="ts">
    interface Props {
        label: string
        name: string
    }

    const props = withDefaults(defineProps<Props>(), {})

    const { errorMessage, value } = useField<string>(props.name)
</script>

<template>
    <FieldWrapper
        :errorMessage="errorMessage"
        :label="props.label"
    >
        <template #default="{ id }">
            <UTextarea
                :id="id"
                v-model="value"
                autoresize
                class="w-full"
            />
        </template>
    </FieldWrapper>
</template>
