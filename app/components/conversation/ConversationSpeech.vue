<script setup lang="ts">
    const model = defineModel({ required: false, type: String as PropType<string> })

    const { isListening, start, stop, transcript } = useSpeech()

    watch(transcript, (v) => {
        model.value = model.value ? model.value + ' ' + v : v
    })
</script>

<template>
    <UButton
        color="neutral"
        :leadingIcon="isListening ? 'lucide:square-stop' : 'lucide:mic'"
        variant="ghost"
        @click="isListening ? stop() : start()"
    />
</template>
