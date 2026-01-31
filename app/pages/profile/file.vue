<script setup lang="ts">
    definePageMeta({ layout: 'dashboard', middleware: 'auth' })

    useSeoMeta({
        description: 'Gestiona tus archivos subidos y generados',
        title: 'Mis Archivos',
    })

    const { data: files } = await useFetch<IFileSchema[]>('/api/file', { default: () => [] })
</script>

<template>
    <UDashboardPanel id="profile-file">
        <template #header>
            <UDashboardNavbar title="Archivos">
                <template #leading>
                    <UDashboardSidebarCollapse />
                </template>
            </UDashboardNavbar>
        </template>

        <template #body>
            <div
                v-if="files?.length"
                class="w-full grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4"
            >
                <ClientOnly>
                    <CommonImage
                        v-for="file in files"
                        :key="file.id"
                        class="aspect-square w-full bg-elevated/75 ring ring-default backdrop-blur rounded-lg"
                        :src="file.url"
                    />
                </ClientOnly>
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
