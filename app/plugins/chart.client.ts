import { Chart, registerables } from 'chart.js'

export default defineNuxtPlugin({
    enforce: 'pre',
    setup() {
        Chart.register(...registerables)
    },
})
