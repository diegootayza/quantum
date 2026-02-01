<script setup lang="ts">
    import { Line } from 'vue-chartjs'

    interface Props {
        dataChart?: any
    }

    const props = withDefaults(defineProps<Props>(), {})

    const lineChart = useChart<'line'>({})
</script>

<template>
    <div class="h-96">
        <Line
            :data="props.dataChart"
            :options="lineChart.options.value"
        />
    </div>
</template>
