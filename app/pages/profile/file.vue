<script setup lang="ts">
    import type { AttachmentSource } from '@prisma/client'

    definePageMeta({ layout: 'dashboard', middleware: 'auth' })

    useSeoMeta({
        description: 'Gestiona tus archivos subidos y generados',
        title: 'Mis Archivos',
    })

    interface Attachment {
        conversationId: string
        createdAt: string
        id: string
        key: null | string
        mimeType: string
        size: number
        source: AttachmentSource
        url: null | string
    }

    const { data } = await useFetch<Attachment[]>('/api/attachment')

    const items = computed(() => data.value || [])

    const generatedFiles = computed(() => items.value.filter((item) => item.source === 'AI_GENERATED'))
    const uploadedFiles = computed(() => items.value.filter((item) => item.source === 'USER_UPLOAD'))

    const isModalOpen = ref(false)
    const selectedFile = ref<Attachment | null>(null)

    function goToConversation() {
        if (selectedFile.value) {
            navigateTo(`/conversation/${selectedFile.value.conversationId}`)
        }
    }

    function openModal(file: Attachment) {
        selectedFile.value = file
        isModalOpen.value = true
    }
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
            <!-- Empty State -->
            <div
                v-if="items.length === 0"
                class="flex flex-col items-center justify-center py-16 px-4 h-full"
            >
                <div class="flex flex-col items-center gap-4 max-w-md text-center">
                    <div class="p-4 rounded-full bg-gray-100 dark:bg-gray-800">
                        <UIcon
                            class="w-12 h-12 text-gray-400 dark:text-gray-600"
                            name="i-lucide-folder-open"
                        />
                    </div>
                    <div class="space-y-2">
                        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">No hay archivos</h3>
                        <p class="text-sm text-gray-500 dark:text-gray-400">Aún no has subido ningún archivo. Los archivos que subas en tus conversaciones aparecerán aquí.</p>
                    </div>
                </div>
            </div>

            <div
                v-else
                class="flex flex-col gap-8"
            >
                <!-- Generated Files Section -->
                <div
                    v-if="generatedFiles.length > 0"
                    class="flex flex-col gap-4"
                >
                    <div class="flex items-center gap-2">
                        <UIcon
                            class="w-5 h-5 text-primary-500"
                            name="i-lucide-sparkles"
                        />
                        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Imágenes generadas</h2>
                        <UBadge
                            color="primary"
                            variant="subtle"
                        >
                            {{ generatedFiles.length }}
                        </UBadge>
                    </div>
                    <div class="w-full grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4">
                        <UCard
                            v-for="item in generatedFiles"
                            :key="item.id"
                            class="aspect-square cursor-pointer hover:ring-2 hover:ring-primary-500 transition-all"
                            :ui="{
                                body: 'flex size-full items-center justify-center p-0 sm:p-0',
                            }"
                            @click="openModal(item)"
                        >
                            <img
                                v-if="item.url"
                                :alt="item.id"
                                class="aspect-square object-cover rounded-lg"
                                :src="item.url"
                            />
                            <div
                                v-else
                                class="flex items-center justify-center size-full"
                            >
                                <UIcon
                                    class="w-12 h-12 text-gray-400"
                                    name="i-lucide-image-off"
                                />
                            </div>
                        </UCard>
                    </div>
                </div>

                <!-- Uploaded Files Section -->
                <div
                    v-if="uploadedFiles.length > 0"
                    class="flex flex-col gap-4"
                >
                    <div class="flex items-center gap-2">
                        <UIcon
                            class="w-5 h-5 text-blue-500"
                            name="i-lucide-upload"
                        />
                        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Archivos subidos</h2>
                        <UBadge
                            color="info"
                            variant="subtle"
                        >
                            {{ uploadedFiles.length }}
                        </UBadge>
                    </div>
                    <div class="w-full grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4">
                        <UCard
                            v-for="item in uploadedFiles"
                            :key="item.id"
                            class="aspect-square cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all"
                            :ui="{
                                body: 'flex size-full items-center justify-center p-0 sm:p-0',
                            }"
                            @click="openModal(item)"
                        >
                            <img
                                v-if="item.url && item.mimeType.startsWith('image/')"
                                :alt="item.id"
                                class="aspect-square object-cover rounded-lg"
                                :src="item.url"
                            />
                            <div
                                v-else
                                class="flex flex-col items-center justify-center size-full gap-2"
                            >
                                <UIcon
                                    class="w-12 h-12 text-gray-400"
                                    name="i-lucide-file"
                                />
                                <span class="text-xs text-gray-500 truncate max-w-full px-2">{{ item.mimeType }}</span>
                            </div>
                        </UCard>
                    </div>
                </div>
            </div>
        </template>
    </UDashboardPanel>

    <!-- Image Preview Modal -->
    <UModal v-model:open="isModalOpen">
        <template #content>
            <UCard
                :ui="{
                    body: 'p-0 sm:p-0',
                    footer: 'flex justify-between items-center',
                }"
            >
                <template #header>
                    <div class="flex items-center justify-between">
                        <h3 class="text-lg font-semibold">Vista previa</h3>
                        <UButton
                            color="neutral"
                            icon="i-lucide-x"
                            variant="ghost"
                            @click="isModalOpen = false"
                        />
                    </div>
                </template>

                <div class="flex items-center justify-center bg-gray-100 dark:bg-gray-900 min-h-[300px] max-h-[70vh]">
                    <img
                        v-if="selectedFile?.url && selectedFile.mimeType.startsWith('image/')"
                        :alt="selectedFile.id"
                        class="max-w-full max-h-[70vh] object-contain"
                        :src="selectedFile.url"
                    />
                    <div
                        v-else
                        class="flex flex-col items-center gap-2 p-8"
                    >
                        <UIcon
                            class="w-16 h-16 text-gray-400"
                            name="i-lucide-file"
                        />
                        <span class="text-sm text-gray-500">{{ selectedFile?.mimeType }}</span>
                    </div>
                </div>

                <template #footer>
                    <div class="flex items-center gap-2 text-sm text-gray-500">
                        <UIcon :name="selectedFile?.source === 'AI_GENERATED' ? 'i-lucide-sparkles' : 'i-lucide-upload'" />
                        <span>{{ selectedFile?.source === 'AI_GENERATED' ? 'Generada por IA' : 'Subido por ti' }}</span>
                    </div>
                    <UButton
                        color="primary"
                        icon="i-lucide-message-square"
                        @click="goToConversation"
                    >
                        Ir a la conversación
                    </UButton>
                </template>
            </UCard>
        </template>
    </UModal>
</template>
