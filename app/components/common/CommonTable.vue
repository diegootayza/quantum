<script setup lang="ts" generic="T extends Record<string, any>">
    interface Props {
        columns: CommonTableColumn[]
        data?: T[]
    }

    const props = withDefaults(defineProps<Props>(), {
        data: () => [],
    })
</script>

<template>
    <div class="relative w-full overflow-x-auto">
        <table class="w-full border-collapse divide-y divide-default text-left border border-default">
            <thead class="bg-elevated/50">
                <tr class="h-10">
                    <th
                        v-for="(column, columnIdx) in columns"
                        :key="columnIdx"
                        :class="['px-4 text-sm font-medium whitespace-nowrap', column.class, column.classHeader]"
                    >
                        {{ column.label }}
                    </th>
                </tr>
            </thead>
            <tbody class="divide-y divide-default">
                <tr v-if="data.length === 0">
                    <td
                        class="px-4 py-2"
                        :colspan="columns.length + 1"
                    >
                        <div class="flex h-20 w-full items-center justify-center">
                            <span class="text-sm">No se encontraron elementos</span>
                        </div>
                    </td>
                </tr>
                <tr
                    v-for="(row, rowIdx) in data"
                    :key="rowIdx"
                >
                    <td
                        v-for="(column, columnIdx) in columns"
                        :key="columnIdx"
                        :class="['p-4 text-sm whitespace-nowrap', column.class, column.classCell]"
                    >
                        <slot
                            v-if="$slots[column.key]"
                            :name="column.key"
                            :row="row"
                        />
                        <template v-else>
                            {{ valueToPath(row, column.key) }}
                        </template>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
