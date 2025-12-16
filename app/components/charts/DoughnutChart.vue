<script setup lang="ts">
    import { ArcElement, Chart as ChartJS, Legend, Title, Tooltip } from 'chart.js'
    import { Doughnut } from 'vue-chartjs'

    ChartJS.register(ArcElement, Title, Tooltip, Legend)

    interface Props {
        data: {
            datasets: Array<{
                backgroundColor: string[]
                borderColor?: string
                borderWidth?: number
                data: number[]
            }>
            labels: string[]
        }
        height?: number
        title?: string
    }

    const props = withDefaults(defineProps<Props>(), {
        height: 300,
    })

    const chartOptions = {
        cutout: '70%',
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                labels: {
                    color: '#9CA3AF',
                    padding: 15,
                },
                position: 'bottom' as const,
            },
            title: {
                color: '#9CA3AF',
                display: !!props.title,
                font: {
                    size: 16,
                },
                text: props.title,
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                bodyColor: '#fff',
                borderColor: '#374151',
                borderWidth: 1,
                callbacks: {
                    label: function (context: any) {
                        const label = context.label || ''
                        const value = context.parsed || 0
                        const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0)
                        const percentage = ((value / total) * 100).toFixed(1)
                        return `${label}: ${value} (${percentage}%)`
                    },
                },
                cornerRadius: 8,
                padding: 12,
                titleColor: '#fff',
            },
        },
        responsive: true,
    }
</script>

<template>
    <div class="w-full" :style="{ height: `${height}px` }">
        <Doughnut :data="data" :options="chartOptions" />
    </div>
</template>
