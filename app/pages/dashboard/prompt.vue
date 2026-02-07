<script setup lang="ts">
    definePageMeta({ layout: 'dashboard', middleware: ['auth', 'admin'] })

    useSeoMeta({
        description: 'Gestiona los prompts del sistema',
        title: 'Prompts - Panel de control',
    })

    const axios = useAxios()

    const { docs, endpoint, initialValues, key, loadMore, params } = useInfiniteScroll<API.Prompt>({
        endpoint: '/api/prompt/list',
        key: 'dashboard-prompt',
        limit: 30,
    })

    const { data, pending } = await useApiAsyncData(key, () => {
        return axios.get<API.ResponseList<API.Prompt>>(endpoint, {
            params: params.value,
        })
    })

    const columns: CommonTableColumn[] = [
        { key: 'description', label: 'Descripción' },
        { class: 'w-px', key: 'key', label: 'Clave' },
        { class: 'w-px text-center', key: 'actions' },
    ]

    watch(data, initialValues, { immediate: true })
</script>

<template>
    <DashboardPage
        :id="key"
        title="Prompts"
    >
        <template #headerRight>
            <ModalPrompt />
        </template>
        <CommonInfiniteScroll @loadMore="loadMore">
            <div class="p-8">
                <DashboardTable
                    :columns="columns"
                    :docs="docs"
                    :pending="pending"
                >
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
