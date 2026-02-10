<script setup lang="ts">
    definePageMeta({ layout: 'dashboard', middleware: ['auth', 'admin'] })

    useSeoMeta({
        description: 'Gestiona los usuarios del sistema',
        title: 'Usuarios - Panel de control',
    })

    const socket = useSocket()
    const axios = useAxios()

    const { docs, endpoint, initialValues, key, loadMore, params } = useInfiniteScroll<API.User>({
        endpoint: '/api/user/list',
        key: 'dashboard-user',
        limit: 30,
    })

    const { data, pending } = await useApiAsyncData(key, () => {
        return axios.get<API.ResponseList<API.User>>(endpoint, {
            params: params.value,
        })
    })

    const {} = await useApiListData('user', {
        params: {
            limit: 100,
        },
    })

    const columns = [
        { class: 'w-px', key: 'devices', label: 'Dispositivos' },
        { class: 'w-px', key: 'name', label: 'Nombre' },
        { class: 'w-px', key: 'surname', label: 'Apellido' },
        { key: 'email', label: 'Correo electrónico' },
        { class: 'w-px', key: 'role', label: 'Rol' },
        { class: 'w-px', key: 'session', label: 'Sesión' },
        { class: 'w-px text-center', key: 'active', label: 'Activo' },
        { class: 'w-px text-center', key: 'actions' },
    ] satisfies CommonTableColumn<API.User>[]

    function onSession(id: string) {
        socket?.emit('user:signout', id)
    }

    function onUpdate(id: string) {
        socket?.emit('user:update', id)
    }

    watch(data, initialValues, { immediate: true })
</script>

<template>
    <DashboardPage
        :id="'dashboard-user'"
        title="Usuarios"
    >
        <template #headerRight>
            <ModalUser />
        </template>
        <CommonInfiniteScroll @loadMore="loadMore">
            <div class="p-8">
                <DashboardTable
                    :columns="columns"
                    :docs="docs"
                    :keys="[key]"
                    :pending="pending"
                >
                    <template #devices="{ row }">
                        <TableDevice :id="row.id" />
                    </template>
                    <template #role="{ row }">
                        <UBadge
                            :ui="{ label: 'text-center w-full', base: 'w-28' }"
                            v-bind="mapUserRole(row.role)"
                            variant="outline"
                        />
                    </template>
                    <template #active="{ row }">
                        <TableActive
                            :id="row.id"
                            :active="row.active"
                            :endpoint="API_ENDPOINT.USER_UPDATE"
                            :name="key"
                            @update="onUpdate"
                        />
                    </template>
                    <template #session="{ row }">
                        <UButton
                            color="error"
                            label="Cerrar sesión"
                            variant="subtle"
                            @click="onSession(row.id)"
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
