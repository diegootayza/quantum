<script setup lang="ts">
    definePageMeta({ layout: 'dashboard', middleware: 'auth' })

    const { user } = useUserSession()

    async function onTest() {
        const response = await fetch('https://quantum-n8n.caprover.diegootayza.com/webhook-test/ce083261-6d6e-425e-b6ce-74f182c94cd6', {
            body: JSON.stringify({
                prompt: 'Cuanto es 2 + 2?',
            }),
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'POST',
        })

        console.log(await response.json())
    }
</script>

<template>
    <UDashboardPanel
        id="setting"
        :ui="{ body: 'lg:py-12' }"
    >
        <template #header>
            <UDashboardNavbar title="Inicio">
                <template #leading>
                    <UDashboardSidebarCollapse />
                </template>
            </UDashboardNavbar>
        </template>

        <template #body>
            <div class="flex flex-col gap-4 sm:gap-6 lg:gap-12 w-full lg:max-w-2xl mx-auto">
                <div class="w-full flex items-center justify-center">
                    <h1 class="text-center text-4xl font-bold">Hola, {{ user?.name }} {{ user?.surname }}</h1>
                    <UButton
                        color="primary"
                        variant="solid"
                        @click="onTest"
                    >
                        Suscribirse
                    </UButton>
                </div>
            </div>
        </template>
    </UDashboardPanel>
</template>
