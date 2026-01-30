<script setup lang="ts" generic="T extends ZodType">
    import type { ZodType } from 'zod'

    import { toTypedSchema } from '@vee-validate/zod'

    interface Props {
        namespace: string
        schema: T
    }

    const props = withDefaults(defineProps<Props>(), {})

    const { handleSubmit, setValues } = useForm({
        initialValues: {
            namespace: props.namespace,
            value: {},
        },
        validationSchema: toTypedSchema(props.schema),
    })

    const onSubmit = handleSubmit(async (data) => {
        await useFetch('/api/setting', {
            body: data,
            method: 'POST',
        })
    })

    onMounted(async () => {
        const data = await $fetch(`/api/setting/${props.namespace}`, {})
        if (data) setValues(data, false)
    })
</script>

<template>
    <form @submit="onSubmit">
        <slot />
    </form>
</template>
