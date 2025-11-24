<script setup lang="ts" generic="T">
    import type { TableColumn } from '@nuxt/ui'

    interface Props {
        columns: TableColumn<T>[]
        data: T[] | undefined
    }

    withDefaults(defineProps<Props>(), {})
</script>

<template>
    <UTable
        class="flex-1"
        :columns="columns"
        :data="data"
        :ui="{
            base: 'table-fixed border-separate border-spacing-0',
            thead: '[&>tr]:bg-elevated/50 [&>tr]:after:content-none',
            tbody: '[&>tr]:last:[&>td]:border-b-0',
            th: 'py-2 first:rounded-l-lg last:rounded-r-lg border-y border-default first:border-l last:border-r',
            td: 'border-b border-default',
            separator: 'h-0',
        }"
    />
</template>
