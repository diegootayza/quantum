<script setup lang="ts">
    interface Props {
        errorMessage?: string
        label: string
    }

    const props = withDefaults(defineProps<Props>(), {
        errorMessage: undefined,
    })

    const id = useId()
</script>

<template>
    <div class="w-full flex flex-col gap-2">
        <label
            class="block font-medium text-default"
            :for="id"
        >
            {{ props.label }}
        </label>
        <slot :id="id" />
        <span>{{ props.errorMessage }}</span>
    </div>
</template>
