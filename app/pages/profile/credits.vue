<script setup lang="ts">
definePageMeta({ layout: 'dashboard', middleware: 'auth' })

const showPurchaseModal = ref(false)
const page = ref(1)
const limit = 20

// Fetch credits balance
const { data: balance, refresh: refreshBalance } = await useFetch('/api/credits/balance')

// Fetch transactions with pagination
const { data: history, pending, refresh: refreshHistory } = await useFetch(() => `/api/credits/transactions?limit=${limit}&offset=${(page.value - 1) * limit}`)

// Columns for the transaction table
const columns = [
    { key: 'createdAt', label: 'Fecha' },
    { key: 'type', label: 'Tipo' },
    { key: 'description', label: 'Descripción' },
    { key: 'amount', label: 'Cantidad' },
    { key: 'balanceAfter', label: 'Saldo' }
]

function handlePurchaseSuccess() {
    refreshBalance()
    refreshHistory()
}

// Watch page change to refresh data
watch(page, () => {
    refreshHistory()
})
</script>

<template>
    <UDashboardPanel id="credits-page" :ui="{ body: 'lg:py-12' }">
        <template #header>
            <UDashboardNavbar title="Mis Créditos">
                <template #leading>
                    <UDashboardSidebarCollapse />
                </template>
            </UDashboardNavbar>
        </template>

        <template #body>
            <div class="flex flex-col gap-6 w-full max-w-6xl mx-auto px-4">
                
                <!-- Credit Balance Card -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <UCard class="bg-gradient-to-br from-gray-900 to-gray-800 text-white relative overflow-hidden border-none ring-0">
                        <!-- Decorative bg -->
                        <div class="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-primary-500/20 blur-3xl"></div>
                        
                        <div class="relative z-10 p-4">
                            <p class="text-gray-400 font-medium mb-1">Saldo Disponible</p>
                            <div class="flex items-center gap-3 mb-6">
                                <UIcon name="i-lucide-coins" class="w-10 h-10 text-yellow-500" />
                                <span class="text-5xl font-bold">{{ balance?.credits?.toLocaleString() || 0 }}</span>
                                <span class="text-xl text-gray-400 self-end mb-2">créditos</span>
                            </div>
                            
                            <UButton 
                                color="primary" 
                                size="lg" 
                                icon="i-lucide-plus"
                                @click="showPurchaseModal = true"
                            >
                                Recargar Créditos
                            </UButton>
                        </div>
                    </UCard>

                    <UCard>
                        <template #header>
                            <h3 class="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                <UIcon name="i-lucide-bar-chart-3" class="w-5 h-5 text-gray-500" />
                                Resumen de Uso
                            </h3>
                        </template>
                        <div class="space-y-4">
                            <div class="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-800">
                                <span class="text-sm text-gray-500">Costo por Video</span>
                                <span class="font-medium">100 créditos</span>
                            </div>
                            <div class="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-800">
                                <span class="text-sm text-gray-500">Capacidad Aprox.</span>
                                <span class="font-medium text-primary-500">{{ Math.floor((balance?.credits || 0) / 100) }} videos</span>
                            </div>
                            <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 text-sm text-gray-500 mt-2">
                                <UIcon name="i-lucide-info" class="w-4 h-4 inline-block mr-1 mb-0.5" />
                                Genera contenido premium sin límites mensuales, paga solo lo que usas.
                            </div>
                        </div>
                    </UCard>
                </div>

                <!-- Transactions History -->
                <UCard title="Historial de Transacciones">
                    <template #header>
                        <div class="flex items-center justify-between">
                            <h3 class="font-semibold text-lg text-gray-900 dark:text-white">Movimientos</h3>
                            <UButton 
                                color="neutral" 
                                variant="ghost" 
                                icon="i-lucide-refresh-cw" 
                                :loading="pending"
                                @click="() => refreshHistory()"
                            />
                        </div>
                    </template>

                    <UTable 
                        :rows="(history?.transactions || []) as any[]" 
                        :columns="columns as any" 
                        :loading="pending"
                        class="w-full"
                    >
                        <template #createdAt-data="{ row }">
                            <span class="text-gray-500 text-sm">
                                {{ new Date((row as any).createdAt).toLocaleDateString() }} {{ new Date((row as any).createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }}
                            </span>
                        </template>

                        <template #type-data="{ row }">
                            <UBadge 
                                :color="(row as any).type === 'PURCHASE' || (row as any).type === 'BONUS' ? 'success' : (row as any).type === 'CONSUMPTION' ? 'neutral' : 'warning'" 
                                variant="subtle"
                            >
                                {{ (row as any).type === 'PURCHASE' ? 'Recarga' : (row as any).type === 'CONSUMPTION' ? 'Consumo' : (row as any).type }}
                            </UBadge>
                        </template>

                        <template #amount-data="{ row }">
                            <span :class="(row as any).amount > 0 ? 'text-green-600 dark:text-green-400 font-medium' : 'text-gray-600 dark:text-gray-400'">
                                {{ (row as any).amount > 0 ? '+' : '' }}{{ (row as any).amount }}
                            </span>
                        </template>
                        
                        <template #balanceAfter-data="{ row }">
                            <span class="text-gray-500 font-mono text-sm">{{ (row as any).balanceAfter.toLocaleString() }}</span>
                        </template>
                    </UTable>

                    <template #footer>
                        <div class="flex justify-center pt-4" v-if="history?.total && history.total > limit">
                            <UPagination v-model="page" :total="history.total" :page-count="limit" />
                        </div>
                    </template>
                </UCard>
            </div>
        </template>

        <!-- Components -->
        <ModalCreditPurchaseModal 
            v-model="showPurchaseModal" 
            @close="showPurchaseModal = false"
            @success="handlePurchaseSuccess"
        />
    </UDashboardPanel>
</template>
