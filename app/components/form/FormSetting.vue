<script setup lang="ts">
    import type { FormSubmitEvent } from '@nuxt/ui'

    interface Props {
        name: string
        namespace: string
        title: string
    }

    const props = withDefaults(defineProps<Props>(), {})

    const state = reactive({
        name: props.name,
        namespace: props.namespace,
        value: null,
    })

    async function onSubmit(event: FormSubmitEvent<SettingSchema>) {
        await $fetch('/api/setting', {
            body: event.data,
            method: 'POST',
        })
        console.log(event.data)
    }

    onMounted(async () => {
        const value = await $fetch('/api/setting', {
            params: {
                name: props.name,
                namespace: props.namespace,
            },
        })

        Object.assign(state, { value: value || null })
    })
</script>

<template>
    <UForm
        :schema="settingSchema"
        :state="state"
        @submit="onSubmit"
    >
        <UPageCard
            :title="title"
            variant="subtle"
        >
            <slot :state="state" />
            <div class="flex justify-end w-full items-center">
                <UButton
                    color="neutral"
                    label="Guardar"
                    type="submit"
                />
            </div>
        </UPageCard>
    </UForm>
</template>
