export function useModels() {
    const models = [
        {
            icon: 'openai',
            label: 'GPT 5.1',
            value: 'openai/gpt-5-mini',
        },
        {
            icon: 'google',
            label: 'Gemini 3',
            value: 'google/gemini-2.5-flash',
        },
        {
            icon: 'anthropic',
            label: 'Claude 4.5',
            value: 'anthropic/claude-haiku-4.5',
        },
        {
            icon: 'xai',
            label: 'Grok 4.1',
            value: 'xai/grok-4.1-fast-reasoning',
        },
    ]

    const model = useCookie<string>('model', { default: () => 'openai/gpt-5-mini' })

    return {
        model,
        models,
    }
}
