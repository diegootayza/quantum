<script setup lang="ts">
    import type { DropdownMenuItem } from '@nuxt/ui'

    defineProps<{ collapsed?: boolean }>()

    const colorMode = useColorMode()
    const router = useRouter()
    const { clear, user } = useUserSession()

    const items = computed<DropdownMenuItem[][]>(() => [
        [
            {
                icon: 'lucide:home',
                label: 'Ir al inicio',
                to: { name: 'index' },
            },
        ],
        [
            {
                children: [
                    {
                        checked: colorMode.value === 'light',
                        icon: 'i-lucide-sun',
                        label: 'Claro',
                        onSelect(e: Event) {
                            e.preventDefault()

                            colorMode.preference = 'light'
                        },
                        type: 'checkbox',
                    },
                    {
                        checked: colorMode.value === 'dark',
                        icon: 'i-lucide-moon',
                        label: 'Oscuro',
                        onSelect(e: Event) {
                            e.preventDefault()
                        },
                        onUpdateChecked(checked: boolean) {
                            if (checked) {
                                colorMode.preference = 'dark'
                            }
                        },
                        type: 'checkbox',
                    },
                ],
                icon: 'i-lucide-sun-moon',
                label: 'Apariencia',
            },
        ],
        [
            {
                icon: 'i-lucide-log-out',
                label: 'Cerrar sesión',
                async onSelect() {
                    await clear()
                    router.push({ name: 'auth-signin' })
                },
            },
        ],
    ])
</script>

<template>
    <UDropdownMenu
        :content="{ align: 'center', collisionPadding: 12 }"
        :items="items"
        :ui="{ content: collapsed ? 'w-48' : 'w-(--reka-dropdown-menu-trigger-width)' }"
    >
        <UButton
            v-bind="{
                icon: 'lucide:user',
                label: collapsed ? undefined : user ? `${user.name} ${user.surname}` : '',
                trailingIcon: collapsed ? undefined : 'i-lucide-chevrons-up-down',
            }"
            block
            class="data-[state=open]:bg-elevated"
            color="neutral"
            :square="collapsed"
            :ui="{
                trailingIcon: 'text-dimmed',
            }"
            variant="ghost"
        />

        <template #chip-leading="{ item }">
            <span
                class="ms-0.5 size-2 rounded-full bg-(--chip-light) dark:bg-(--chip-dark)"
                :style="{'--chip-light': `var(--color-${(item as any).chip}-500)`, '--chip-dark': `var(--color-${(item as any).chip}-400)`
        }"
            />
        </template>
    </UDropdownMenu>
</template>
