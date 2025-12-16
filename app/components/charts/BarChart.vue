<script setup lang="ts">
    import {
        BarElement,
        CategoryScale,
        Chart as ChartJS,
        Legend,
        LinearScale,
        Title,
        Tooltip,
    } from 'chart.js'
    import { Bar } from 'vue-chartjs'

    ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

    interface Props {
        data: {
            datasets: Array<{
                backgroundColor: string | string[]
                borderColor?: string
                borderRadius?: number
                borderWidth?: number
                data: number[]
                label: string
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
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                labels: {
                    color: '#9CA3AF',
                },
                position: 'top' as const,
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
                cornerRadius: 8,
                padding: 12,
                titleColor: '#fff',
            },
        },
        responsive: true,
        scales: {
            x: {
                grid: {
                    display: false,
                },
                ticks: {
                    color: '#9CA3AF',
                },
            },
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(156, 163, 175, 0.1)',
                },
                ticks: {
                    color: '#9CA3AF',
                },
            },
        },
    }
</script>

<template>
    <div class="w-full" :style="{ height: `${height}px` }">
        <Bar :data="data" :options="chartOptions" />
    </div>
</template>
