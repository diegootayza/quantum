<script setup lang="ts">
    const files = defineModel({
        required: true,
        type: Array as () => File[],
    })

    const items = computed(() => {
        return files.value.map((file) => {
            const type = file.type.split('/')[0]

            return {
                src: type === 'image' ? fileToObjectURL(file) : undefined,
                type,
            }
        })
    })

    function onRemove(index: number) {
        files.value.splice(index, 1)
    }
</script>

<template>
    <div class="w-full grid grid-cols-[repeat(auto-fill,minmax(60px,1fr))] gap-2">
        <UCard
            v-for="(item, index) in items"
            :key="index"
            class="aspect-square"
            :ui="{
                body: 'flex size-full items-center justify-center p-0 sm:p-0',
            }"
            @click="onRemove(index)"
        >
            <img
                v-if="item.src"
                alt=""
                class="object-cover"
                :src="item.src"
            />
            <UIcon
                v-else
                class="size-6"
                name="lucide:file"
            />
        </UCard>
    </div>
</template>
