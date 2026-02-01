<script setup lang="ts">
    import type { UIDataTypes, UIMessagePart, UITools } from 'ai'

    interface Props {
        part: UIMessagePart<UIDataTypes, UITools>
    }

    const props = withDefaults(defineProps<Props>(), {})

    const output = computed(() => {
        if (props.part.type === AI_TOOL.FETCH_URL) {
            return props.part.output as string
        }
        return null
    })
</script>

<template>
    <div
        v-if="props.part.type === AI_TOOL.FETCH_URL"
        class="w-full"
    >
        <ChatSkeletonText
            v-if="props.part.state === 'input-streaming'"
            text="Descargando la URL..."
        />
        <ChatSkeletonText
            v-else-if="props.part.state === 'input-available'"
            text="Analizando la URL..."
        />
        <MDCCached
            v-else-if="props.part.state === 'output-available' && output"
            :cacheKey="props.part.toolCallId"
            class="*:first:mt-0 *:last:mb-0"
            :parserOptions="{ highlight: false }"
            :value="output"
        />
        <ChatError
            v-else-if="props.part.state === 'output-error'"
            :errorText="props.part.errorText"
        />
    </div>
</template>
