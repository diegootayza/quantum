<script setup lang="ts">
    import type { DropdownMenuItem } from '@nuxt/ui'

    interface Props {
        id: string
        name: string
    }

    const props = withDefaults(defineProps<Props>(), {})

    const confirmModal = useConfirmModal()

    const items = computed<DropdownMenuItem[]>(() => {
        return [
            {
                icon: 'lucide:edit',
                label: 'Editar',
                async onSelect() {
                    navigateTo({ name: props.name, query: { id: props.id } })
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
                    confirmModal.open({
                        confirmButtonLabel: 'Eliminar',
                        description: '¿Estás seguro de que deseas eliminar? Esta acción no se puede deshacer.',
                        onConfirm: async () => {
                            console.log(props.id)
                        },
                        title: 'Eliminar',
                    })
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
