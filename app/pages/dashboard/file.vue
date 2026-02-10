<script setup lang="ts">
    definePageMeta({ layout: 'dashboard', middleware: ['auth', 'admin'] })

    useSeoMeta({
        description: 'Gestiona los archivos del sistema',
        title: 'Archivos ',
    })

    const axios = useAxios()

    const { docs, endpoint, initialValues, key, loadMore, params } = useInfiniteScroll<API.File>({
        endpoint: API_ENDPOINT.FILE_LIST,
        key: PAGE_NAME.DASHBOARD_FILE,
        limit: 30,
    })

    const { data, pending } = await useApiAsyncData(key, () => {
        return axios.get<API.ResponseList<API.File>>(endpoint, {
            params: params.value,
        })
    })

    const columns: CommonTableColumn[] = [
        { key: 'mimeType', label: 'Tipo de contenido' },
        { class: 'w-px text-center', key: 'size', label: 'Tamaño' },
        { class: 'w-px text-center', key: 'type', label: 'Tipo' },
        { class: 'w-px text-center', key: 'url', label: 'URL' },
        { class: 'w-px text-center', key: 'actions' },
    ]

    watch(data, initialValues, { immediate: true })
</script>

<template>
    <DashboardPage
        :id="key"
        title="Archivos"
    >
        <template #headerRight>
            <ModalChat />
        </template>
        <CommonInfiniteScroll @loadMore="loadMore">
            <div class="p-8">
                <DashboardTable
                    :columns="columns"
                    :docs="docs"
                    :pending="pending"
                >
                    <template #size="{ row }">
                        <UBadge
                            color="neutral"
                            :label="formatFileSize(row.size)"
                            :ui="{ label: 'text-center w-full', base: 'w-24 p-2' }"
                            variant="outline"
                        />
                    </template>
                    <template #type="{ row }">
                        <UBadge
                            :ui="{ label: 'text-center w-full', base: 'w-28' }"
                            v-bind="mapFileType(row.type)"
                            variant="outline"
                        />
                    </template>
                    <template #url="{ row }">
                        <UButton
                            color="info"
                            :href="row.url"
                            icon="lucide:eye"
                            target="_blank"
                            variant="outline"
                        />
                    </template>
                    <template #actions="{ row }">
                        <TableAction
                            :id="row.id"
                            :name="key"
                        />
                    </template>
                </DashboardTable>
            </div>
        </CommonInfiniteScroll>
    </DashboardPage>
</template>
