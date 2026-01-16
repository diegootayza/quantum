<script setup lang="ts">
    useSeoMeta({
        description: 'Accede a los mejores modelos de IA en una sola plataforma. ChatGPT, Claude, Gemini y más, todo en un solo lugar.',
        title: 'Quantum - Todos los modelos de IA en un solo lugar',
    })

    const features = [
        {
            description: 'Accede a ChatGPT, Claude, Gemini, Llama y muchos más desde una única interfaz.',
            icon: 'i-lucide-layers',
            title: 'Múltiples modelos',
        },
        {
            description: 'Olvídate de pagar múltiples suscripciones. Un solo pago, acceso a todo.',
            icon: 'i-lucide-wallet',
            title: 'Un solo pago',
        },
        {
            description: 'Cambia entre modelos en cualquier momento según tus necesidades.',
            icon: 'i-lucide-repeat',
            title: 'Flexibilidad total',
        },
        {
            description: 'Interfaz limpia y fácil de usar. Empieza a conversar en segundos.',
            icon: 'i-lucide-zap',
            title: 'Simple y rápido',
        },
        {
            description: 'Guarda y organiza todas tus conversaciones en un solo lugar.',
            icon: 'i-lucide-message-square',
            title: 'Historial unificado',
        },
        {
            description: 'Tus datos están protegidos con los más altos estándares de seguridad.',
            icon: 'i-lucide-shield-check',
            title: 'Seguro y privado',
        },
    ]
</script>

<template>
    <div>
        <!-- Hero Section -->
        <UPageHero
            description="Accede a ChatGPT, Claude, Gemini y los mejores modelos de IA desde una sola plataforma."
            orientation="horizontal"
            title="Todos los modelos de IA en un solo lugar"
        >
            <template #links>
                <UButton
                    label="Comenzar gratis"
                    size="xl"
                    :to="{ name: 'auth-signup' }"
                    trailingIcon="i-lucide-arrow-right"
                />
            </template>

            <img
                alt="Quantum Dashboard"
                class="rounded-lg shadow-2xl ring-1 ring-default"
                src="https://placehold.co/800x500/1a1a2e/ffffff?text=Quantum+Dashboard"
            />
        </UPageHero>

        <!-- Features Section -->
        <UPageSection
            description="Todo lo que necesitas para potenciar tu productividad con inteligencia artificial."
            title="¿Por qué elegir Quantum?"
        >
            <UPageGrid>
                <UPageCard
                    v-for="feature in features"
                    :key="feature.title"
                    :description="feature.description"
                    :icon="feature.icon"
                    :title="feature.title"
                />
            </UPageGrid>
        </UPageSection>

        <!-- CTA Section -->
        <UPageSection>
            <UPageCTA
                description="Únete a miles de usuarios que ya disfrutan de todos los modelos de IA en un solo lugar."
                title="¿Listo para empezar?"
            >
                <template #links>
                    <UButton
                        label="Crear cuenta gratis"
                        size="xl"
                        :to="{ name: 'auth-signup' }"
                        trailingIcon="i-lucide-arrow-right"
                    />
                </template>
            </UPageCTA>
        </UPageSection>
    </div>
</template>
