<script setup lang="ts">
    definePageMeta({ layout: 'dashboard', middleware: 'auth' })

    const { user, fetch: refreshUser } = useUserSession()
    const { data: subscriptions, pending } = await useFetch('/api/subscription')
    const toast = useToast()
    const { safeExecute } = useSafeError()

    const loading = ref(false)

    async function subscribe(subscriptionId: string) {
        loading.value = true
        
        const success = await safeExecute(async () => {
            await $fetch('/api/subscription/subscribe', {
                method: 'POST',
                body: { subscriptionId },
            })
            await refreshUser()
            toast.add({ title: 'Suscripción actualizada', color: 'success' })
            return true
        })
        
        loading.value = false
    }
</script>

<template>
    <UDashboardPanel
        id="subscription"
        :ui="{ body: 'lg:py-12' }"
    >
        <template #header>
            <UDashboardNavbar title="Suscripción">
                <template #leading>
                    <UDashboardSidebarCollapse />
                </template>
            </UDashboardNavbar>
        </template>

        <template #body>
            <div class="flex flex-col gap-4 sm:gap-6 lg:gap-12 w-full lg:max-w-5xl mx-auto">
                <div class="text-center">
                    <h1 class="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                        Planes de suscripción
                    </h1>
                    <p class="mt-4 text-lg leading-6 text-gray-500 dark:text-gray-400">
                        Elige el plan que mejor se adapte a tus necesidades.
                    </p>
                </div>

                <div v-if="pending" class="flex justify-center py-12">
                    <UIcon name="i-lucide-loader-2" class="animate-spin w-10 h-10 text-primary-500" />
                </div>

                <div v-else class="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    <UCard
                        v-for="plan in subscriptions"
                        :key="plan.id"
                        :ui="{
                            body: { base: 'flex flex-col h-full' },
                            ring: user?.subscriptionId === plan.id ? 'ring-2 ring-primary-500 dark:ring-primary-400' : '',
                        }"
                        class="flex flex-col"
                    >
                        <template #header>
                            <h3 class="text-xl font-semibold leading-7 text-gray-900 dark:text-white">
                                {{ plan.name }}
                            </h3>
                            <p class="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
                                {{ plan.description }}
                            </p>
                        </template>

                        <div class="flex-1 flex flex-col">
                            <div class="flex items-baseline gap-x-2">
                                <span class="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
                                    {{ plan.price }} {{ plan.currency }}
                                </span>
                                <span class="text-sm font-semibold leading-6 text-gray-500 dark:text-gray-400">
                                    / {{ plan.interval }}
                                </span>
                            </div>

                            <ul role="list" class="mt-6 space-y-3 text-sm leading-6 text-gray-600 dark:text-gray-300 flex-1">
                                <li v-for="feature in plan.features" :key="String(feature)" class="flex gap-x-3">
                                    <UIcon name="i-lucide-check" class="h-6 w-5 flex-none text-primary-600 dark:text-primary-400" aria-hidden="true" />
                                    {{ feature }}
                                </li>
                                <li v-for="service in plan.services" :key="service.id" class="flex gap-x-3">
                                    <UIcon name="i-lucide-check" class="h-6 w-5 flex-none text-primary-600 dark:text-primary-400" aria-hidden="true" />
                                    {{ service.name }}
                                </li>
                            </ul>
                        </div>

                        <template #footer>
                            <UButton
                                block
                                :color="user?.subscriptionId === plan.id ? 'gray' : 'primary'"
                                :variant="user?.subscriptionId === plan.id ? 'soft' : 'solid'"
                                :loading="loading && user?.subscriptionId !== plan.id"
                                :disabled="user?.subscriptionId === plan.id || loading"
                                @click="subscribe(plan.id)"
                            >
                                {{ user?.subscriptionId === plan.id ? 'Plan Actual' : 'Suscribirse' }}
                            </UButton>
                        </template>
                    </UCard>
                </div>
            </div>
        </template>
    </UDashboardPanel>
</template>
