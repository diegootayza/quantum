<script setup lang="ts">
    import type { EditorToolbarItem } from '@nuxt/ui'

    interface Props {
        label: string
        name: string
    }

    const props = withDefaults(defineProps<Props>(), {})

    const { errorMessage, value } = useField<string>(props.name)

    const items: EditorToolbarItem[][] = [
        [
            {
                content: {
                    align: 'start',
                },
                icon: 'i-lucide-heading',
                items: [
                    {
                        icon: 'i-lucide-heading-1',
                        kind: 'heading',
                        label: 'Heading 1',
                        level: 1,
                    },
                    {
                        icon: 'i-lucide-heading-2',
                        kind: 'heading',
                        label: 'Heading 2',
                        level: 2,
                    },
                    {
                        icon: 'i-lucide-heading-3',
                        kind: 'heading',
                        label: 'Heading 3',
                        level: 3,
                    },
                    {
                        icon: 'i-lucide-heading-4',
                        kind: 'heading',
                        label: 'Heading 4',
                        level: 4,
                    },
                ],
                tooltip: { text: 'Headings' },
            },
        ],
        [
            {
                icon: 'i-lucide-bold',
                kind: 'mark',
                mark: 'bold',
                tooltip: { text: 'Bold' },
            },
            {
                icon: 'i-lucide-italic',
                kind: 'mark',
                mark: 'italic',
                tooltip: { text: 'Italic' },
            },
            {
                icon: 'i-lucide-underline',
                kind: 'mark',
                mark: 'underline',
                tooltip: { text: 'Underline' },
            },
            {
                icon: 'i-lucide-strikethrough',
                kind: 'mark',
                mark: 'strike',
                tooltip: { text: 'Strikethrough' },
            },
            {
                icon: 'i-lucide-code',
                kind: 'mark',
                mark: 'code',
                tooltip: { text: 'Code' },
            },
        ],
    ]
</script>

<template>
    <FieldWrapper
        :errorMessage="errorMessage"
        :label="props.label"
    >
        <template #default="{}">
            <UEditor
                v-slot="{ editor }"
                v-model="value"
                contentType="markdown"
                :ui="{ base: 'p-4 sm:p-4', root: 'ring ring-inset ring-accented' }"
            >
                <UEditorToolbar
                    :editor="editor"
                    :items="items"
                    layout="fixed"
                />
            </UEditor>
        </template>
    </FieldWrapper>
</template>
