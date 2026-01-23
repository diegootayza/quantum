export function useModels() {
    const { user } = useUserSession()

    const models = computed(() => {
        const items = []

        if (user.value?.role === 'ADMIN') {
            items.push({ icon: 'openai', label: 'GPT 5.2', value: 'openai/gpt-5.2' })
        }

        items.push({ icon: 'openai', label: 'GPT 5', value: 'openai/gpt-5-mini' })
        items.push({ icon: 'google', label: 'Gemini 3', value: 'google/gemini-3-flash' })
        items.push({ icon: 'anthropic', label: 'Claude 4.5', value: 'anthropic/claude-haiku-4.5' })

        return items
    })

    const model = useCookie<string>('model', { default: () => (user.value?.role === 'ADMIN' ? 'openai/gpt-5.2' : 'openai/gpt-5-mini') })

    return {
        model,
        models,
    }
}
