<script setup lang="ts">
    const socket = useSocket()
    const { clearSession, updateSession } = useAuth()

    const open = ref(false)

    onMounted(() => {
        socket?.on('user:signout', async () => {
            await clearSession()
        })

        socket?.on('user:update', async () => {
            await updateSession()
        })
    })
</script>

<template>
    <UDashboardGroup unit="rem">
        <UDashboardSidebar
            v-model:open="open"
            class="bg-elevated/25"
            collapsible
            :defaultSize="25"
            :maxSize="30"
            :minSize="20"
            resizable
            :ui="{ footer: 'lg:border-t lg:border-default' }"
        >
            <template #header="{ collapsed }">
                <div class="w-full flex items-center justify-between gap-2 px-2">
                    <div class="flex items-center gap-2">
                        <UIcon
                            class="size-6"
                            name="lucide:atom"
                        />
                        <span
                            v-if="!collapsed"
                            class="font-bold"
                        >
                            Quantum IA
                        </span>
                    </div>
                    <UColorModeButton
                        v-if="!collapsed"
                        color="neutral"
                        variant="ghost"
                    />
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
