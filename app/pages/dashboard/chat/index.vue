<script setup lang="ts">
    definePageMeta({ layout: 'dashboard', middleware: ['auth', 'admin'] })

    useSeoMeta({
        description: 'Gestiona los chats de los usuarios',
        title: 'Chats - Panel de control',
    })

    type Response = { user: API.User } & API.Chat

    const axios = useAxios()

    const { docs, endpoint, initialValues, key, loadMore, params } = useInfiniteScroll<Response>({
        endpoint: '/api/chat/list',
        key: 'dashboard-chat',
        limit: 30,
        query: {
            user: true,
        },
    })

    const { data, pending } = await useApiAsyncData(key, () => {
        return axios.get<API.ResponseList<Response>>(endpoint, {
            params: params.value,
        })
    })

    const columns: CommonTableColumn[] = [
        { key: 'name', label: 'Nombre' },
        { key: 'user', label: 'Usuario' },
        { class: 'w-px text-center', key: 'actions' },
    ]

    watch(data, initialValues, { immediate: true })
</script>

<template>
    <DashboardPage
        :id="key"
        title="Chats"
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
                    <template #user="{ row }">
                        <span>{{ row.user.name }} {{ row.user.surname }}</span>
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
