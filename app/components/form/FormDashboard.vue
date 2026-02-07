<script setup lang="ts" generic="T extends ZodType">
    import type { ZodType } from 'zod'

    import { toTypedSchema } from '@vee-validate/zod'

    interface Props {
        createUrl: string
        name: string
        readUrl: string
        schema: T
        title: string
        updateUrl: string
    }

    const props = withDefaults(defineProps<Props>(), {})

    const route = useRoute()
    const axios = useAxios()

    const open = ref(false)

    const id = computed(() => route.query.id as string | undefined)

    const { handleSubmit, setValues } = useForm({
        validationSchema: toTypedSchema(props.schema),
    })

    function onReset() {
        open.value = false
        navigateTo({ query: { ...route.query, id: undefined } }, { replace: true })
    }

    const onSubmit = handleSubmit(async (data) => {
        if (id.value) await axios.patch(`${props.updateUrl}/${id.value}`, data)
        else await axios.post(`${props.createUrl}`, data)
        onReset()
        await refreshNuxtData(props.name)
    })

    watch(
        id,
        async (v) => {
            if (v) {
                const { data } = await axios.get(`${props.readUrl}/${v}`)

                if (data) {
                    setValues(data, false)
                    open.value = true
                }
            }
        },
        { immediate: true },
    )
</script>

<template>
    <UModal
        v-model:open="open"
        :description="props.title"
        :title="id ? 'Actualizar' : 'Crear'"
        @after:leave="onReset"
    >
        <UButton
            icon="lucide:plus"
            label="Nuevo"
        />

        <template #body>
            <form
                class="grid grid-cols-1 gap-4 w-full"
                @submit="onSubmit"
            >
                <slot />
                <div class="flex justify-end gap-2 w-full">
                    <UButton
                        color="neutral"
                        label="Cancelar"
                        variant="subtle"
                        @click="onReset"
                    />
                    <UButton
                        color="primary"
                        label="Guardar"
                        type="submit"
                        variant="solid"
                    />
                </div>
            </form>
        </template>
    </UModal>
</template>
