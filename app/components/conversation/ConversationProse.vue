<script setup lang="ts">
    import { ShikiCachedRenderer } from 'shiki-stream/vue'

    const colorMode = useColorMode()
    const highlighter = await useHighlighter()
    const props = defineProps<{
        class?: string
        code: string
        language: string
        meta?: string
    }>()
    const trimmedCode = computed(() => {
        return props.code.trim().replace(/`+$/, '')
    })
    const lang = computed(() => {
        switch (props.language) {
            case 'css':
                return 'css'
            case 'javascript':
                return 'js'
            case 'typescript':
                return 'ts'
            case 'vue':
                return 'vue'
            default:
                return props.language
        }
    })
    const key = computed(() => {
        return `${lang.value}-${colorMode.value}`
    })
</script>

<template>
    <ProsePre v-bind="props">
        <ShikiCachedRenderer
            :key="key"
            :code="trimmedCode"
            :highlighter="highlighter"
            :lang="lang"
            :theme="colorMode.value === 'dark' ? 'material-theme-palenight' : 'material-theme-lighter'"
        />
    </ProsePre>
</template>
