<script setup lang="ts" generic="T extends ZodType">
    import type { ZodType } from 'zod'

    import { toTypedSchema } from '@vee-validate/zod'

    interface Props {
        name: string
        schema: T
        title: string
        url: string
    }

    const props = withDefaults(defineProps<Props>(), {})

    const route = useRoute()
    const router = useRouter()

    const open = ref(false)

    const id = computed(() => route.query.id as string | undefined)

    const { handleSubmit, setValues } = useForm({
        validationSchema: toTypedSchema(props.schema),
    })

    function onReset() {
        open.value = false
        router.push({ name: props.name })
    }

    const onSubmit = handleSubmit(async (data) => {
        if (id.value) await $fetch(`${props.url}/${id.value}`, { body: data, method: 'PATCH' })
        else await $fetch(`${props.url}`, { body: data, method: 'POST' })
        onReset()
        await refreshNuxtData(props.name)
    })

    watch(
        id,
        async (v) => {
            if (v) {
                const data = await $fetch(`${props.url}/${v}`)

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
        :ui="{ content: 'max-w-6xl' }"
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
