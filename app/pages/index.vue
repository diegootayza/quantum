<script setup lang="ts">
definePageMeta({
  layout: 'default'
})

useSeoMeta({
  title: 'Quantum',
  description: 'AI-Powered Content Generation Platform'
})
</script>

<template>
  <div class="min-h-screen flex flex-col justify-center items-center bg-white dark:bg-gray-950 text-center px-4 relative overflow-hidden">
    <!-- Background Gradient Blob -->
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary-500/20 rounded-full blur-[100px] -z-10"></div>

    <div class="space-y-8 max-w-2xl mx-auto z-10">
      <!-- Logo / Icon -->
      <div class="flex justify-center">
        <div class="p-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xl">
          <UIcon name="i-lucide-atom" class="w-16 h-16 text-primary-500" />
        </div>
      </div>

      <!-- Hero Text -->
      <div class="space-y-4">
        <h1 class="text-5xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-7xl">
          Quantum
        </h1>
        <p class="text-lg text-gray-500 dark:text-gray-400 max-w-lg mx-auto">
          Generación de video e interacción con LLMs de vanguardia en una sola plataforma.
        </p>
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <NuxtLink to="/auth/login" class="w-full sm:w-auto">
          <UButton size="xl" color="neutral" variant="ghost" class="w-full justify-center" icon="i-lucide-log-in">
            Iniciar Sesión
          </UButton>
        </NuxtLink>
        <NuxtLink to="/auth/register" class="w-full sm:w-auto">
          <UButton size="xl" color="primary" variant="solid" class="w-full justify-center shadow-lg hover:shadow-primary-500/50 transition-all font-bold px-8" icon="i-lucide-rocket">
            Comenzar Gratis
          </UButton>
        </NuxtLink>
      </div>


      
      <!-- Footer Info -->
      <p class="text-xs text-center text-gray-400 dark:text-gray-600 mt-12">
        Quantum IA v1.0.0
      </p>
    </div>
  </div>
</template>
