<script setup lang="ts">
    interface Emit {
        (e: 'loadMore'): void
    }

    interface Props {}

    const props = withDefaults(defineProps<Props>(), {})

    const emit = defineEmits<Emit>()

    const container = useTemplateRef('container')
    const sentinel = useTemplateRef('sentinel')

    let observer: IntersectionObserver

    onMounted(() => {
        observer = new IntersectionObserver(
            (entries) => {
                if (entries[0]?.isIntersecting) {
                    emit('loadMore')
                }
            },
            { root: container.value, threshold: 0.1 },
        )

        if (sentinel.value) observer.observe(sentinel.value)
    })

    onBeforeUnmount(() => {
        observer?.disconnect()
    })
</script>

<template>
    <div
        ref="container"
        class="overflow-y-auto flex-1"
    >
        <slot />
        <div
            ref="sentinel"
            class="w-full h-px"
        />
    </div>
</template>
