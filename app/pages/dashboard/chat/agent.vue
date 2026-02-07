<script setup lang="ts">
    definePageMeta({ layout: 'dashboard', middleware: ['auth', 'admin'] })

    useSeoMeta({
        description: 'Gestiona los agentes del sistema',
        title: 'Agentes - Panel de control',
    })

    const axios = useAxios()

    const { docs, endpoint, initialValues, key, loadMore, params } = useInfiniteScroll<API.ChatAgent>({
        endpoint: '/api/chat-agent/list',
        key: 'dashboard-chat-agent',
        limit: 30,
    })

    const { data, pending } = await useApiAsyncData(key, () => {
        return axios.get<API.ResponseList<API.ChatAgent>>(endpoint, {
            params: params.value,
        })
    })

    const columns: CommonTableColumn[] = [
        { key: 'name', label: 'Nombre' },
        { key: 'description', label: 'Descripción' },
        { key: 'model', label: 'Modelo' },
        { class: 'w-px', key: 'active', label: 'Activo' },
        { class: 'w-px text-center', key: 'actions' },
    ]

    watch(data, initialValues, { immediate: true })
</script>

<template>
    <DashboardPage
        :id="key"
        title="Agentes"
    >
        <template #headerRight>
            <ModalChatAgent />
        </template>
        <CommonInfiniteScroll @loadMore="loadMore">
            <div class="p-8">
                <DashboardTable
                    :columns="columns"
                    :docs="docs"
                    :pending="pending"
                >
                    <template #active="{ row }">
                        <TableActive
                            :id="row.id"
                            :active="row.active"
                            :endpoint="API_ENDPOINT.CHAT_AGENT_UPDATE"
                            :name="key"
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
