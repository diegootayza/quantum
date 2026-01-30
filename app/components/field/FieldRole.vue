<script setup lang="ts" generic="M extends boolean">
    interface Props {
        label: string
        multiple?: M
        name: string
    }

    const props = withDefaults(defineProps<Props>(), {
        multiple: undefined,
    })

    const { errorMessage, value } = useField<M extends true ? string[] : string>(props.name)
</script>

<template>
    <FieldWrapper
        :errorMessage="errorMessage"
        :label="props.label"
    >
        <template #default="{ id }">
            <USelectMenu
                :id="id"
                v-model="value"
                class="w-full"
                :items="[
                    { label: 'Administrador', value: 'ADMIN' },
                    { label: 'Usuario', value: 'USER' },
                ]"
                labelKey="label"
                :multiple="props.multiple"
                valueKey="value"
            />
        </template>
    </FieldWrapper>
</template>
