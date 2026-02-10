<script setup lang="ts" generic="T">
    import { useInfiniteScroll } from '@vueuse/core'

    interface Props {
        cursor: null | string
        distance?: number
        items: T[]
        ui?: { viewport?: string }
    }

    const props = withDefaults(defineProps<Props>(), {
        distance: 100,
        ui: () => ({}),
    })

    const scrollArea = useTemplateRef('scroll-area')

    onMounted(() => {
        useInfiniteScroll(
            scrollArea.value?.$el,
            async () => {
                await refreshNuxtData('users')
            },
            {
                canLoadMore: () => {
                    return props.cursor !== null
                },
                distance: props.distance,
            },
        )
    })
</script>

<template>
    <CommonContainer v-slot="{ height }">
        <UScrollArea
            ref="scroll-area"
            v-slot="{ item, index }"
            :items="props.items"
            :style="{ height: `${height}px`, width: '100%' }"
            :ui="{ viewport: props.ui?.viewport }"
            virtualize
        >
            <slot
                :index="index"
                :item="item"
            />
        </UScrollArea>
    </CommonContainer>
</template>
