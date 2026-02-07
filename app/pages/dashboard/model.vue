<script setup lang="ts">
    definePageMeta({ layout: 'dashboard', middleware: ['auth', 'admin'] })

    useSeoMeta({
        description: 'Gestiona los modelos de IA disponibles',
        title: 'Modelos - Panel de control',
    })

    const axios = useAxios()

    const { docs, endpoint, initialValues, key, loadMore, params } = useInfiniteScroll<API.Model>({
        endpoint: '/api/model/list',
        key: 'dashboard-model',
        limit: 30,
    })

    const { data, pending } = await useApiAsyncData(key, () => {
        return axios.get<API.ResponseList<API.Model>>(endpoint, {
            params: params.value,
        })
    })

    const columns: CommonTableColumn[] = [
        { key: 'name', label: 'Nombre' },
        { key: 'value', label: 'Valor' },
        { class: 'w-px', key: 'roles', label: 'Roles' },
        { class: 'w-px', key: 'active', label: 'Activo' },
        { class: 'w-px text-center', key: 'actions' },
    ]

    watch(data, initialValues, { immediate: true })
</script>

<template>
    <DashboardPage
        :id="key"
        title="Modelos"
    >
        <template #headerRight>
            <ModalModel />
        </template>
        <CommonInfiniteScroll @loadMore="loadMore">
            <div class="p-8">
                <DashboardTable
                    :columns="columns"
                    :docs="docs"
                    :pending="pending"
                >
                    <template #roles="{ row }">
                        <TableConstant :value="row.roles" />
                    </template>
                    <template #active="{ row }">
                        <TableActive
                            :id="row.id"
                            :active="row.active"
                            endpoint="/api/model"
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
