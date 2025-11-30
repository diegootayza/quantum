type MaybeSpeechRecognition = null | SpeechRecognition

export function useSpeech() {
    const isListening = ref<boolean>(false)
    const transcript = ref<string>('')
    const recognition = ref<MaybeSpeechRecognition>(null)

    const createInstance = (): MaybeSpeechRecognition => {
        const SpeechRecognitionConstructor = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

        if (!SpeechRecognitionConstructor) {
            if (import.meta.dev) {
                console.warn('SpeechRecognition no es compatible con este navegador.')
            }
            return null
        }

        const instance: SpeechRecognition = new SpeechRecognitionConstructor()
        instance.lang = 'es-ES'
        instance.continuous = false
        instance.interimResults = false

        instance.onstart = () => {
            isListening.value = true
        }

        instance.onresult = (event: SpeechRecognitionEvent) => {
            const result = event.results[0]?.[0]
            if (result) {
                transcript.value = result.transcript
            }
        }

        instance.onerror = (event: SpeechRecognitionErrorEvent) => {
            if (import.meta.dev) {
                console.error('Error en dictado:', event.error)
            }
        }

        instance.onend = () => {
            isListening.value = false
        }

        return instance
    }

    const start = (): void => {
        if (!recognition.value) {
            recognition.value = createInstance()
        }
        recognition.value?.start()
    }

    const stop = (): void => {
        recognition.value?.stop()
    }

    const abort = (): void => {
        recognition.value?.abort()
        isListening.value = false
    }

    return {
        abort,
        isListening,
        start,
        stop,
        transcript,
    }
}
