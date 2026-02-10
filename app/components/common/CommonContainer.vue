<script setup lang="ts">
    interface Props {}

    const props = withDefaults(defineProps<Props>(), {})

    const element = useTemplateRef('element')

    const observer = ref<null | ResizeObserver>(null)

    const height = ref(0)
    const width = ref(0)

    onMounted(() => {
        if (!element.value) return

        observer.value = new ResizeObserver((entries) => {
            for (const entry of entries) {
                height.value = entry.contentRect.height
                width.value = entry.contentRect.width
            }
        })

        observer.value.observe(element.value)
    })

    onUnmounted(() => {
        if (observer.value) {
            observer.value.disconnect()
        }
    })
</script>

<template>
    <div
        ref="element"
        class="flex-1"
    >
        <slot
            :height="height"
            :width="width"
        />
    </div>
</template>
