import type { ChartOptions, ChartType, ChartTypeRegistry } from 'chart.js'

export function useChart<T extends ChartType = keyof ChartTypeRegistry>({ decorator }: { decorator?: (options: ChartOptions<T>) => void }) {
    const colorMode = useColorMode()

    const preference = ref('')

    const options = computed<ChartOptions<T>>(() => {
        const fontFamily = getCSSVariable('font-family')
        const fontColor = getCSSVariable('--ui-text')
        const borderColor = getCSSVariable('--ui-border')
        const bgColor = getCSSVariable('--ui-bg')
        const reload = preference.value

        const baseOptions: ChartOptions<T> = {
            animation: {
                duration: 1000,
                easing: 'easeOutExpo',
            },
            color: fontColor,
            datasets: {
                line: {
                    pointStyle: 'rectRounded',
                },
            },
            font: {
                family: fontFamily,
            },
            interaction: {
                intersect: false,
                mode: 'index',
            },
            maintainAspectRatio: false,
            plugins: {
                colors: {
                    enabled: true,
                    forceOverride: false,
                },
                legend: {
                    color: fontColor,
                    pointStyle: 'rectRounded',
                    usePointStyle: true,
                },
                subtitle: {
                    display: false,
                },
                title: {
                    display: false,
                },
                tooltip: {
                    animation: { duration: 400, easing: 'easeOutQuad' },
                    backgroundColor: bgColor,
                    bodyColor: fontColor,
                    bodyFont: { family: fontFamily },
                    borderColor,
                    borderWidth: 1,
                    caretPadding: 6,
                    cornerRadius: 8,
                    footerColor: fontColor,
                    footerFont: { family: fontFamily },
                    padding: 8,
                    titleColor: fontColor,
                    titleFont: { family: fontFamily },
                    titleMarginBottom: 12,
                    usePointStyle: true,
                },
            },
            responsive: true,
            scales: {
                x: {
                    grid: {
                        color: borderColor,
                        tickColor: borderColor,
                    },
                    ticks: {
                        color: fontColor,
                        font: { family: fontFamily },
                    },
                },
                y: {
                    grid: {
                        color: borderColor,
                        tickColor: borderColor,
                    },
                    ticks: {
                        color: fontColor,
                        font: { family: fontFamily },
                    },
                },
            },
        } as unknown as ChartOptions<T>

        if (decorator) decorator(baseOptions)

        return baseOptions
    })

    watch(
        () => colorMode.value,
        () => {
            preference.value = colorMode.value
        },
    )

    return { options }
}
