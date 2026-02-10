<script setup lang="ts" generic="T extends RecordType">
    interface Props {
        columns: CommonTableColumn<T>[]
        docs?: T[]
        keys?: string[]
        pending?: boolean
    }

    const props = withDefaults(defineProps<Props>(), {
        docs: () => [],
        keys: () => [],
        pending: false,
    })

    const route = useRoute()

    const search = ref(String(route.query.search ?? ''))

    const cleanSearch = computed(() => formatSearchText(search.value))

    const debouncedSearch = useDebounceFn(() => {
        if (cleanSearch.value.length > 0) navigateTo({ query: { ...route.query, search: cleanSearch.value } }, { replace: true })
        else navigateTo({ query: { ...route.query, search: undefined } }, { replace: true })
    }, 350)

    async function onReload() {
        if (!props.keys.length) return
        await refreshNuxtData(props.keys)
    }

    watch(cleanSearch, () => {
        debouncedSearch()
    })
</script>

<template>
    <div class="w-full grid grid-cols-1 gap-8 relative">
        <div class="w-full flex items-center justify-between">
            <div>
                <UInput
                    v-model="search"
                    class="w-sm"
                    name="search-dashboard-table"
                    placeholder="Buscar..."
                >
                    <template
                        v-if="search.length > 0"
                        #trailing
                    >
                        <UButton
                            aria-label="Clear input"
                            color="neutral"
                            icon="i-lucide-circle-x"
                            size="sm"
                            variant="link"
                            @click="search = ''"
                        />
                    </template>
                </UInput>
            </div>
            <div>
                <UButton
                    icon="lucide:loader-circle"
                    @click="onReload"
                />
            </div>
        </div>
        <div
            v-if="props.pending"
            class="flex items-center justify-center"
        >
            <UIcon
                class="size-14 animate-spin"
                name="lucide:loader-circle"
            />
        </div>
        <UEmpty
            v-else-if="props.docs.length === 0"
            description="Aún no has subido ningún archivo. Los archivos que subas en tus conversaciones aparecerán aquí."
            icon="lucide:folder-open"
            title="No hay archivos"
        />
        <div
            v-else
            class="w-full overflow-x-auto"
        >
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
                    <tr
                        v-for="(row, rowIdx) in props.docs"
                        :key="rowIdx"
                    >
                        <td
                            v-for="(column, columnIdx) in columns"
                            :key="columnIdx"
                            :class="['p-4 text-sm whitespace-nowrap', column.class, column.classCell]"
                        >
                            <slot
                                :name="column.key"
                                :row="row"
                            >
                                {{ valueToPath(row, column.key) }}
                            </slot>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
