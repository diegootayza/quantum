<script setup lang="ts" generic="T extends FormSchema">
    import type { FormSchema, FormSubmitEvent } from '@nuxt/ui'

    import { z } from 'zod'
    import { getDefaultsForSchema } from 'zod-defaults'

    interface Emit {
        (e: 'refresh'): void
    }

    interface Props {
        isFormData?: boolean
        name: string
        schema: T
        title: string
        url: string
    }

    const emit = defineEmits<Emit>()

    const props = withDefaults(defineProps<Props>(), {
        isFormData: false,
    })

    const route = useRoute()
    const router = useRouter()

    const form = useTemplateRef('form')

    const open = ref(false)
    const state = reactive<z.output<T>>(getDefaultsForSchema(props.schema))

    const id = computed(() => route.query.id as string | undefined)

    function onReset() {
        Object.assign(state, { ...getDefaultsForSchema(props.schema), id: undefined })
        ;(state as any).existingFiles = []
        ;(state as any).files = []
        router.push({ name: props.name })
        open.value = false
    }

    async function onSubmit(event: FormSubmitEvent<z.output<T>>) {
        const body = props.isFormData ? toFormData(state as unknown as Record<string, unknown>) : event.data

        if (id.value) await $fetch(`${props.url}/${id.value}`, { body, method: 'PATCH' })
        else await $fetch(`${props.url}`, { body, method: 'POST' })

        emit('refresh')
        onReset()
    }

    function submitForm() {
        ;(form.value as any)?.submit?.()
    }

    function toFormData(input: Record<string, unknown>) {
        const formData = new FormData()

        for (const [key, value] of Object.entries(input)) {
            if (value === undefined || value === null) continue

            if (key === 'existingFiles') continue

            if (value instanceof File || value instanceof Blob) {
                formData.append(key, value)
                continue
            }

            if (Array.isArray(value)) {
                for (const item of value) {
                    if (item === undefined || item === null) continue
                    if (item instanceof File || item instanceof Blob) formData.append(key, item)
                    else formData.append(key, String(item))
                }
                continue
            }

            if (typeof value === 'boolean') {
                formData.append(key, value ? 'true' : 'false')
                continue
            }

            if (typeof value === 'object') continue

            formData.append(key, String(value))
        }

        return formData
    }

    watch(
        id,
        async (v) => {
            if (v) {
                const response = await $fetch(`${props.url}/${v}`)
                Object.assign(state as any, response)
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
                ref="form"
                class="space-y-4"
                :schema="schema"
                :state="state"
                @submit="onSubmit"
            >
                <slot :state="state" />
            </UForm>
        </template>

        <template #footer>
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
                    variant="solid"
                    @click="submitForm"
                />
            </div>
        </template>
    </UModal>
</template>
