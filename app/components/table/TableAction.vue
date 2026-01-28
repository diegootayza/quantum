<script setup lang="ts">
    import type { DropdownMenuItem } from '@nuxt/ui'

    interface Props {
        id: string
        name: string
    }

    const props = withDefaults(defineProps<Props>(), {})

    const router = useRouter()

    const items = computed<DropdownMenuItem[]>(() => {
        return [
            {
                icon: 'lucide:edit',
                label: 'Editar',
                async onSelect() {
                    router.push({ name: props.name, query: { id: props.id } })
                },
            },
            {
                type: 'separator',
            },
            {
                color: 'error',
                icon: 'lucide:trash',
                label: 'Eliminar',
                onSelect() {
                    console.log(props.id)
                },
            },
        ]
    })
</script>

<template>
    <UDropdownMenu :items="items">
        <UButton
            color="neutral"
            icon="lucide:ellipsis-vertical"
            variant="ghost"
        />
    </UDropdownMenu>
</template>
