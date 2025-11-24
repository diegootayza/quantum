<script setup lang="ts">
    const columns = [
        {
            children: [
                {
                    label: 'Help center',
                },
                {
                    label: 'Docs',
                },
                {
                    label: 'Roadmap',
                },
                {
                    label: 'Changelog',
                },
            ],
            label: 'Resources',
        },
        {
            children: [
                {
                    label: 'Affiliates',
                },
                {
                    label: 'Portal',
                },
                {
                    label: 'Jobs',
                },
                {
                    label: 'Sponsors',
                },
            ],
            label: 'Features',
        },
        {
            children: [
                {
                    label: 'About',
                },
                {
                    label: 'Pricing',
                },
                {
                    label: 'Careers',
                },
                {
                    label: 'Blog',
                },
            ],
            label: 'Company',
        },
    ]

    const toast = useToast()

    const email = ref('')
    const loading = ref(false)

    function onSubmit() {
        loading.value = true

        toast.add({
            description: "You've been subscribed to our newsletter.",
            title: 'Subscribed!',
        })
    }
</script>

<template>
    <USeparator
        class="h-px"
        icon="i-simple-icons-nuxtdotjs"
    />

    <UFooter :ui="{ top: 'border-b border-default' }">
        <template #top>
            <UContainer>
                <UFooterColumns :columns="columns">
                    <template #right>
                        <form @submit.prevent="onSubmit">
                            <UFormField
                                label="Subscribe to our newsletter"
                                name="email"
                                size="lg"
                            >
                                <UInput
                                    v-model="email"
                                    class="w-full"
                                    placeholder="Enter your email"
                                    type="email"
                                >
                                    <template #trailing>
                                        <UButton
                                            color="neutral"
                                            label="Subscribe"
                                            size="xs"
                                            type="submit"
                                        />
                                    </template>
                                </UInput>
                            </UFormField>
                        </form>
                    </template>
                </UFooterColumns>
            </UContainer>
        </template>

        <template #left>
            <p class="text-muted text-sm">Built with Nuxt UI • © {{ new Date().getFullYear() }}</p>
        </template>

        <template #right>
            <UButton
                aria-label="Nuxt on Discord"
                color="neutral"
                icon="i-simple-icons-discord"
                target="_blank"
                to="https://go.nuxt.com/discord"
                variant="ghost"
            />
            <UButton
                aria-label="Nuxt on X"
                color="neutral"
                icon="i-simple-icons-x"
                target="_blank"
                to="https://go.nuxt.com/x"
                variant="ghost"
            />
            <UButton
                aria-label="Nuxt UI on GitHub"
                color="neutral"
                icon="i-simple-icons-github"
                target="_blank"
                to="https://github.com/nuxt-ui-templates/saas"
                variant="ghost"
            />
        </template>
    </UFooter>
</template>
