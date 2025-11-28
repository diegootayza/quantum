<script setup lang="ts">
    const { model, models } = useModels()

    const items = computed(() =>
        models.map((model) => ({
            icon: `i-simple-icons-${model.split('/')[0]}`,
            label: model,
            value: model,
        }))
    )
</script>

<template>
    <USelectMenu
        v-model="model"
        class="hover:bg-default focus:bg-default data-[state=open]:bg-default"
        :icon="`simple-icons:${model.split('/')[0]}`"
        :items="items"
        :ui="{
            trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200',
        }"
        valueKey="value"
        variant="ghost"
    />
</template>
