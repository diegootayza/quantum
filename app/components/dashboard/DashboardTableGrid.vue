<script setup lang="ts" generic="T extends RecordType">
    type Column = {
        key: string
        label: string
    }

    interface Props {
        ariaLabel?: string
        columns: Column[]
        rowKey?: ((row: any, index: number) => number | string) | string
        rows: any[]
    }

    const props = withDefaults(defineProps<Props>(), {
        ariaLabel: 'Tabla',
        rowKey: 'id',
    })

    const axios = useAxios()

    const cursor = ref<null | string>(null)

    const { data } = await useAsyncData('users', async () => {
        const { data } = await axios.get<API.ResponseList<API.User>>(API_ENDPOINT.USER_LIST, {
            params: {
                cursor: cursor.value,
                limit: 50,
            },
        })
        return data
    })

    const items = shallowRef<API.User[]>([])

    const cols = computed(() => props.columns.length)

    function getRowKey(row: any, index: number) {
        if (typeof props.rowKey === 'function') return props.rowKey(row, index)
        if (typeof props.rowKey === 'string') return row?.[props.rowKey] ?? index
        return row?.id ?? index
    }

    watch(
        data,
        (v) => {
            if (!v) return

            items.value = [...items.value, ...v.docs]
            cursor.value = v.meta.nextCursor
        },

        { immediate: true },
    )
</script>

<template>
    <div class="p-8 grid gap-8 flex-1 grid-rows-[auto_1fr]">
        <div class="bg-accented">{{ cursor }}</div>
        <div
            :aria-label="props.ariaLabel"
            class="border border-default rounded-md grid grid-rows-1fr md:grid-rows-[auto_1fr] divide-y divide-default flex-1"
            role="table"
        >
            <div
                class="row head bg-elevated/50"
                role="row"
            >
                <div
                    v-for="col in columns"
                    :key="col.key"
                    class="cell"
                    role="columnheader"
                >
                    {{ col.label }}
                </div>
            </div>
            <CommonScrollArea
                v-slot="{ item, index }"
                :cursor="cursor"
                :items="items"
                :ui="{ viewport: 'divide-y divide-default' }"
            >
                <div
                    :key="getRowKey(item, index)"
                    class="row"
                    role="row"
                >
                    <div
                        v-for="col in columns"
                        :key="col.key"
                        class="cell truncate"
                        :data-label="col.label"
                        role="cell"
                    >
                        <slot
                            :col="col"
                            :name="`cell:${col.key}`"
                            :row="item"
                            :value="item[col.key as keyof typeof item]"
                        >
                            {{ item[col.key as keyof typeof item] }}
                        </slot>
                    </div>
                </div>
            </CommonScrollArea>
            <div
                v-if="!items?.length"
                class="empty"
            >
                <slot name="empty">Sin datos</slot>
            </div>
        </div>
    </div>
</template>

<style>
    .row {
        display: grid;
        grid-template-columns: repeat(v-bind(cols), minmax(0, 1fr));
    }

    .cell {
        padding: 12px 14px;
    }

    .row:not(.head):hover {
        background: #f8fafc;
    }

    .row.head {
        position: sticky;
        top: 0;
        font-weight: 700;
        z-index: 1;
    }

    .empty {
        padding: 18px;
        color: #64748b;
    }

    @media (max-width: 720px) {
        .row.head {
            display: none;
        }

        .row {
            grid-template-columns: 1fr;
            padding: 10px 12px;
        }

        .cell {
            display: grid;
            grid-template-columns: 120px 1fr;
            padding: 8px 0;
        }

        .cell::before {
            content: attr(data-label);
            font-weight: 700;
            color: #64748b;
        }
    }
</style>
