<script setup lang="ts">
    const open = ref(false)
</script>

<template>
    <UDashboardGroup unit="rem">
        <UDashboardSidebar
            v-model:open="open"
            class="bg-elevated/25"
            collapsible
            :defaultSize="20"
            :maxSize="20"
            :minSize="20"
            resizable
            :ui="{ footer: 'lg:border-t lg:border-default' }"
        >
            <template #header>
                <div class="w-full flex items-center justify-start gap-2 px-2">
                    <UIcon
                        class="size-6"
                        name="lucide:atom"
                    />
                    <span class="font-bold">Quantum IA</span>
                </div>
            </template>
            <template #default="{ collapsed }">
                <DashboardNavigation
                    v-model:open="open"
                    :collapsed="collapsed"
                />
            </template>

            <template #footer="{ collapsed }">
                <UserMenu :collapsed="collapsed" />
            </template>
        </UDashboardSidebar>

        <slot />
    </UDashboardGroup>
</template>
