<script setup lang="ts">
    const model = defineModel<string>()

    const { data } = await useFetch('/api/dashboard/category', {})
</script>

<template>
    <USelectMenu
        v-model="model"
        :items="data"
        labelKey="name"
        valueKey="id"
    />
</template>
