<script setup lang="ts">
    interface Props {
        isStreaming?: boolean
        text: string
    }

    const props = withDefaults(defineProps<Props>(), {
        isStreaming: false,
    })

    const open = ref(false)

    watch(
        () => props.isStreaming,
        () => {
            open.value = props.isStreaming
        },
        { immediate: true }
    )

    function cleanMarkdown(text: string): string {
        return text
            .replace(/\*\*(.+?)\*\*/g, '$1') // Remove bold
            .replace(/\*(.+?)\*/g, '$1') // Remove italic
            .replace(/`(.+?)`/g, '$1') // Remove inline code
            .replace(/^#+\s+/gm, '') // Remove headers
    }
</script>

<template>
    <UCollapsible
        v-model:open="open"
        class="flex flex-col gap-1 my-5"
    >
        <UButton
            class="p-0 group"
            color="neutral"
            :label="isStreaming ? 'Thinking...' : 'Thoughts'"
            trailingIcon="i-lucide-chevron-down"
            :ui="{
                trailingIcon: text.length > 0 ? 'group-data-[state=open]:rotate-180 transition-transform duration-200' : 'hidden',
            }"
            variant="link"
        />

        <template #content>
            <div
                v-for="(value, index) in cleanMarkdown(text).split('\n').filter(Boolean)"
                :key="index"
            >
                <span class="whitespace-pre-wrap text-sm text-muted font-normal">{{ value }}</span>
            </div>
        </template>
    </UCollapsible>
</template>
