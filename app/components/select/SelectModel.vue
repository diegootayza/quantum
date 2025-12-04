<script setup lang="ts">
    const { model, models } = useModels()

    const items = computed(() =>
        models.map((model) => ({
            label: model.label,
            value: model.value,
        }))
    )
</script>

<template>
    <USelectMenu
        v-model="model"
        class="hover:bg-default focus:bg-default data-[state=open]:bg-default w-[140px]"
        :items="items"
        :ui="{
            trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200',
        }"
        valueKey="value"
        variant="ghost"
    />
</template>
