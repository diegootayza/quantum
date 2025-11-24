<script setup lang="ts" generic="T extends FormSchema">
    import type { FormSchema, FormSubmitEvent } from '@nuxt/ui'

    import { z } from 'zod'
    import { getDefaultsForSchema } from 'zod-defaults'

    interface Emit {
        (e: 'refresh'): void
    }

    interface Props {
        name: string
        schema: T
        title: string
        url: string
    }

    const emit = defineEmits<Emit>()

    const props = withDefaults(defineProps<Props>(), {})

    const route = useRoute()
    const router = useRouter()

    const open = ref(false)
    const state = reactive<z.output<T>>(getDefaultsForSchema(props.schema))

    const id = computed(() => route.query.id as string | undefined)

    function onReset() {
        Object.assign(state, { ...getDefaultsForSchema(props.schema), id: undefined })
        router.push({ name: props.name })
        open.value = false
    }

    async function onSubmit(event: FormSubmitEvent<InstructionSchema>) {
        if (id.value) await $fetch(`${props.url}/${id.value}`, { body: event.data, method: 'PATCH' })
        else await $fetch(`${props.url}`, { body: event.data, method: 'POST' })
        emit('refresh')
        onReset()
    }

    watch(
        id,
        async (v) => {
            if (v) {
                const response = await $fetch(`${props.url}/${v}`)
                Object.assign(state, z.parse(props.schema, response))
                open.value = true
            }
        },
        { immediate: true }
    )
</script>

<template>
    <UModal
        v-model:open="open"
        :description="title"
        :title="id ? 'Editar' : 'Nueva'"
        @after:leave="onReset"
    >
        <UButton
            icon="lucide:plus"
            label="Nuevo"
        />

        <template #body>
            <UForm
                class="space-y-4"
                :schema="schema"
                :state="state"
                @submit="onSubmit"
            >
                <slot :state="state" />

                <div class="flex justify-end gap-2">
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
            </UForm>
        </template>
    </UModal>
</template>
