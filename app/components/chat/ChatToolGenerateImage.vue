<script setup lang="ts">
    import type { UIDataTypes, UIMessagePart, UITools } from 'ai'

    interface Props {
        part: UIMessagePart<UIDataTypes, UITools>
    }

    type TInput = {
        n: number
        prompt: string
    }

    type TOutput = string[]

    const props = withDefaults(defineProps<Props>(), {})

    const input = computed(() => {
        if (props.part.type === AI_TOOL.GENERATE_IMAGE) {
            return props.part.input as TInput
        }
        return null
    })

    const output = computed(() => {
        if (props.part.type === AI_TOOL.GENERATE_IMAGE) {
            return props.part.output as TOutput
        }
        return null
    })
</script>

<template>
    <div v-if="props.part.type === AI_TOOL.GENERATE_IMAGE">
        <ChatSkeletonText
            v-if="props.part.state === 'input-streaming'"
            text="Generando imagen(es)..."
        />
        <div
            v-else-if="props.part.state === 'input-available' && input"
            class="w-full grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4"
        >
            <div
                v-for="v in input.n"
                :key="v"
                class="aspect-square w-full bg-elevated/75 ring ring-default backdrop-blur rounded-lg animate-pulse flex items-center justify-center"
            >
                <UIcon
                    class="size-10 animate-spin"
                    name="lucide:loader-circle"
                />
            </div>
        </div>
        <div
            v-else-if="props.part.state === 'output-available' && output"
            class="w-full grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4"
        >
            <ClientOnly>
                <CommonImage
                    v-for="v in output"
                    :key="v"
                    class="aspect-square w-full bg-elevated/75 ring ring-default backdrop-blur rounded-lg"
                    :src="v"
                />
            </ClientOnly>
        </div>
        <ChatError
            v-else-if="props.part.state === 'output-error'"
            :errorText="props.part.errorText"
        />
    </div>
</template>
