<script setup lang="ts">
    const emit = defineEmits(['close', 'success'])

    const { data: packages, pending } = await useFetch('/api/credits/packages')
    const loading = ref(false)
    const selectedPackage = ref<null | string>(null)

    async function handlePurchase(pkg: any) {
        selectedPackage.value = pkg.id
        loading.value = true
        try {
            await $fetch('/api/credits/purchase', {
                body: { creditPackageId: pkg.id },
                method: 'POST',
            })

            const description = pkg.bonusCredits > 0 ? `Has adquirido ${pkg.credits + pkg.bonusCredits} créditos correctamente.` : `Has adquirido ${pkg.credits} créditos correctamente.`

            useToast().add({
                color: 'primary',
                description,
                icon: 'i-lucide-check-circle',
                title: 'Compra exitosa',
            })

            emit('success')
            emit('close')
        } catch (error: any) {
            useToast().add({
                color: 'error',
                description: error.data?.message || 'Hubo un problema al procesar tu compra',
                icon: 'i-lucide-alert-circle',
                title: 'Error en la compra',
            })
        } finally {
            loading.value = false
            selectedPackage.value = null
        }
    }
</script>

<template>
    <UModal>
        <div class="flex min-h-full items-center justify-center text-center sm:items-center sm:p-0">
            <UCard class="w-full sm:max-w-4xl">
                <template #header>
                    <div class="flex items-center justify-between">
                        <h3 class="text-xl font-bold text-gray-900 dark:text-white">Recargar Créditos</h3>
                        <UButton
                            color="neutral"
                            icon="i-heroicons-x-mark-20-solid"
                            variant="ghost"
                            @click="$emit('close')"
                        />
                    </div>
                    <p class="mt-1 text-sm text-gray-500">Selecciona un paquete para añadir créditos a tu cuenta</p>
                </template>

                <div
                    v-if="pending"
                    class="flex justify-center py-12"
                >
                    <UIcon
                        class="h-8 w-8 animate-spin text-primary-500"
                        name="i-lucide-loader-2"
                    />
                </div>

                <div
                    v-else
                    class="grid grid-cols-1 gap-6 py-4 md:grid-cols-3"
                >
                    <div
                        v-for="pkg in packages"
                        :key="pkg.id"
                        class="relative flex cursor-pointer flex-col rounded-xl border-2 bg-white p-6 transition-all duration-200 hover:border-primary-500 hover:shadow-lg dark:bg-gray-900"
                        :class="[pkg.bonusCredits > 0 ? 'border-primary-200 dark:border-primary-900' : 'border-gray-100 dark:border-gray-800']"
                        @click="handlePurchase(pkg)"
                    >
                        <!-- Badge de Mejor Valor o Popular (Simulado por ahora con el de mayor precio/bonus) -->
                        <div
                            v-if="pkg.bonusCredits > 500"
                            class="absolute -top-3 left-1/2 -translate-x-1/2"
                        >
                            <span class="rounded-full bg-linear-to-r from-primary-500 to-indigo-600 px-3 py-1 text-xs font-bold text-white shadow-md"> MEJOR VALOR </span>
                        </div>

                        <div class="space-y-4 text-center">
                            <div>
                                <p class="text-sm font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">{{ pkg.name }}</p>
                                <div class="mt-2 flex items-baseline justify-center gap-1">
                                    <span class="text-3xl font-extrabold text-gray-900 dark:text-white">${{ pkg.price }}</span>
                                    <span class="text-sm text-gray-500">{{ pkg.currency }}</span>
                                </div>
                            </div>

                            <div class="border-t border-gray-100 py-4 dark:border-gray-800">
                                <div class="flex items-center justify-center gap-2">
                                    <UIcon
                                        class="h-6 w-6 text-yellow-500"
                                        name="i-lucide-coins"
                                    />
                                    <span class="text-2xl font-bold text-primary-600 dark:text-primary-400">
                                        {{ pkg.credits.toLocaleString() }}
                                    </span>
                                </div>
                                <p
                                    v-if="pkg.bonusCredits > 0"
                                    class="mt-1 text-sm font-medium text-green-500"
                                >
                                    +{{ pkg.bonusCredits.toLocaleString() }} Créditos GRATIS
                                </p>
                            </div>

                            <div class="min-h-10 text-sm text-gray-500 dark:text-gray-400">
                                {{ pkg.description }}
                            </div>

                            <UButton
                                block
                                color="primary"
                                :disabled="loading && selectedPackage !== pkg.id"
                                :loading="loading && selectedPackage === pkg.id"
                                size="lg"
                                variant="solid"
                            >
                                Comprar Ahora
                            </UButton>
                        </div>
                    </div>
                </div>

                <div class="mt-6 flex items-start gap-3 rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
                    <UIcon
                        class="mt-0.5 h-5 w-5 shrink-0 text-gray-400"
                        name="i-lucide-info"
                    />
                    <div class="text-sm text-gray-500 dark:text-gray-400">
                        <p class="mb-1 font-medium text-gray-900 dark:text-gray-200">¿Cómo funcionan los créditos?</p>
                        <p>Los créditos se utilizan para generar contenido premium. Cada video generado consume aproximadamente 100 créditos. Los créditos no caducan mientras tu cuenta esté activa.</p>
                    </div>
                </div>
            </UCard>
        </div>
    </UModal>
</template>
