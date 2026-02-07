<script setup lang="ts">
    definePageMeta({ layout: 'dashboard', middleware: 'auth' })

    useSeoMeta({
        description: 'Gestiona tus archivos subidos y generados',
        title: 'Mis Archivos',
    })

    const axios = useAxios()

    const { data } = await useApiAsyncData('profile-files', () => axios.get<API.ProfileFilesResponse[]>('/api/profile/files'))

    const generatedFiles = computed(() => data.value?.filter((file) => file.type === 'generated') || [])
    const uploadedFiles = computed(() => data.value?.filter((file) => file.type === 'upload') || [])
</script>

<template>
    <UDashboardPanel id="profile-files">
        <template #header>
            <UDashboardNavbar title="Archivos">
                <template #leading>
                    <UDashboardSidebarCollapse />
                </template>
            </UDashboardNavbar>
        </template>

        <template #body>
            <div
                v-if="data?.length"
                class="w-full grid grid-cols-1 gap-8"
            >
                <div class="w-full grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4">
                    <ClientOnly>
                        <CommonImage
                            v-for="file in generatedFiles"
                            :key="file.id"
                            class="aspect-square w-full bg-elevated/75 ring ring-default backdrop-blur rounded-lg"
                            :size="file.size"
                            :src="file.url"
                        />
                    </ClientOnly>
                </div>
                <div class="w-full grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4">
                    <ClientOnly>
                        <CommonImage
                            v-for="file in uploadedFiles"
                            :key="file.id"
                            class="aspect-square w-full bg-elevated/75 ring ring-default backdrop-blur rounded-lg"
                            :size="file.size"
                            :src="file.url"
                        />
                    </ClientOnly>
                </div>
            </div>
            <UEmpty
                v-else
                description="Aún no has subido ningún archivo. Los archivos que subas en tus conversaciones aparecerán aquí."
                icon="lucide:folder-open"
                title="No hay archivos"
            />
        </template>
    </UDashboardPanel>
</template>
