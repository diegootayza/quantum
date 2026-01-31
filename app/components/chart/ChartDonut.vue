<script setup lang="ts">
    import { Donut } from '@unovis/ts'
    import { VisDonut, VisSingleContainer, VisTooltip } from '@unovis/vue'

    interface DataItem {
        label: string
        value: number
    }

    interface Props {
        data: DataItem[]
    }

    const props = withDefaults(defineProps<Props>(), {})

    const triggers = {
        [Donut.selectors.segment]: (d: { data: DataItem }) => {
            return `${d.data.label}: ${d.data.value}`
        },
    }

    const value = (d: DataItem) => d.value
</script>

<template>
    <VisSingleContainer :data="props.data">
        <VisTooltip :triggers="triggers" />
        <VisDonut :value="value" />
    </VisSingleContainer>
</template>
