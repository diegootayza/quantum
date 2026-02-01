<script setup lang="ts">
    import type { DropdownMenuItem } from '@nuxt/ui'

    const { data } = await useFetch('/api/model', { query: { mode: 'chat' } })

    const model = useCookie<string>('chat-model', { default: () => 'openai/gpt-5-mini' })

    const items = computed<DropdownMenuItem[]>(() => {
        const values = data.value?.docs ?? []

        return values.map((item) => ({
            label: item.name,
            onSelect: () => {
                model.value = item.value
            },
        }))
    })

    const label = computed(() => {
        const found = data.value?.docs.find((item) => item.value === model.value)
        return found ? found.name : 'Seleccionar modelo'
    })
</script>

<template>
    <UDropdownMenu
        :content="{
            align: 'start',
            side: 'bottom',
            sideOffset: 8,
        }"
        :items="items"
    >
        <UButton
            color="neutral"
            :label="label"
            variant="ghost"
        />
    </UDropdownMenu>
</template>
