<script setup lang="ts">
    const { loggedIn } = useUserSession()
</script>

<template>
    <UHeader>
        <template #left>
            <NuxtLink
                class="flex items-center gap-2 text-xl font-bold"
                to="/"
            >
                <UIcon
                    class="size-7"
                    name="i-lucide-atom"
                />
                Quantum
            </NuxtLink>
        </template>

        <template #right>
            <UColorModeButton />

            <template v-if="loggedIn">
                <UButton
                    class="lg:hidden"
                    color="neutral"
                    icon="i-lucide-message-circle"
                    :to="{ name: 'chat' }"
                    variant="ghost"
                />

                <UButton
                    class="hidden lg:inline-flex"
                    icon="i-lucide-message-circle"
                    label="Ir al chat"
                    :to="{ name: 'chat' }"
                />
            </template>

            <template v-else>
                <UButton
                    class="lg:hidden"
                    color="neutral"
                    icon="i-lucide-log-in"
                    :to="{ name: 'auth-signin' }"
                    variant="ghost"
                />

                <UButton
                    class="hidden lg:inline-flex"
                    color="neutral"
                    label="Iniciar sesión"
                    :to="{ name: 'auth-signin' }"
                    variant="ghost"
                />

                <UButton
                    class="hidden lg:inline-flex"
                    label="Registrarse"
                    :to="{ name: 'auth-signup' }"
                />
            </template>
        </template>

        <template #body>
            <template v-if="loggedIn">
                <UButton
                    block
                    icon="i-lucide-layout-dashboard"
                    label="Ir al chat"
                    :to="{ name: 'chat' }"
                />
            </template>

            <template v-else>
                <UButton
                    block
                    class="mb-3"
                    color="neutral"
                    label="Iniciar sesión"
                    :to="{ name: 'auth-signin' }"
                    variant="subtle"
                />
                <UButton
                    block
                    label="Registrarse"
                    :to="{ name: 'auth-signup' }"
                />
            </template>
        </template>
    </UHeader>
</template>
