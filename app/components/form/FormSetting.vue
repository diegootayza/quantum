<script setup lang="ts" generic="T extends ZodType">
    import type { ZodType } from 'zod'

    import { toTypedSchema } from '@vee-validate/zod'

    interface Props {
        namespace: string
        schema: T
    }

    const props = withDefaults(defineProps<Props>(), {})

    const axios = useAxios()

    const { handleSubmit, setValues } = useForm({
        initialValues: {
            namespace: props.namespace,
            value: {},
        },
        validationSchema: toTypedSchema(props.schema),
    })

    const onSubmit = handleSubmit(async (data) => {
        await axios.post(API_ENDPOINT.SETTING_CREATE_OR_UPDATE, data)
    })

    onMounted(async () => {
        const { data } = await axios.get(`${API_ENDPOINT.SETTING_NAMESPACE}/ai`)
        if (data) setValues(data, false)
    })
</script>

<template>
    <form @submit="onSubmit">
        <slot />
    </form>
</template>
