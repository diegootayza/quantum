# Proyecto: Quantum (Nuxt 4)

Stack:

- Framework: Nuxt 4 (Vue 3, Vite, Nitro)
- Lenguaje: TypeScript en modo estricto
- Estado: Pinia + pinia-plugin-persistedstate
- Validación: Zod + zod-defaults
- Formularios: @tanstack/vue-form
- UI: @nuxt/ui + Tailwind CSS v4
- Base de datos: Prisma (MongoDB)
- Autenticación: nuxt-auth-utils
- Tiempo real: socket.io-client
- IA: ai SDK + OpenAI + ai-sdk/vue
- HTTP: axios (solo cuando no aplique useFetch)
- Utilidades: VueUse, Unhead
- Lint: ESLint 9 (Flat Config)
- Gestor de paquetes: pnpm
- Runtime: ESM

Reglas para Copilot:

## Arquitectura

- Usar siempre las convenciones de Nuxt 4 (Nitro, rutas server, composables, plugins).
- Usar Composition API y `<script setup lang="ts">`.
- No usar Options API.
- Preferir funciones y composables, evitar clases.

## TypeScript

- Tipado estricto, nunca usar `any`.
- Preferir `unknown` antes que `any`.
- Todas las funciones deben estar tipadas.
- Usar genéricos cuando aplique (Prisma, TanStack, SDK de IA).

## Vue / Nuxt

- Usar auto-imports de Nuxt.
- Preferir `useFetch`, `useAsyncData` o rutas server antes que axios directo en el cliente.
- El estado global siempre con Pinia en formato setup.
- Usar `useRuntimeConfig()` en vez de `process.env`.

## Backend / Prisma

- Las consultas Prisma deben ser type-safe y usar `select` o `include`.
- No exponer modelos Prisma directamente al frontend; mapear a DTOs.
- Validar entradas y salidas con esquemas Zod.

## UI / Estilos

- Usar solo Tailwind CSS v4 (sin estilos inline).
- Priorizar componentes de Nuxt UI.
- Mantener orden lógico de clases.

## Inteligencia Artificial

- Usar patrones del SDK `ai`.
- Preferir streaming cuando sea posible.
- Tipar mensajes y respuestas con Zod.

## Estilo de código

- Estilo funcional, sin efectos secundarios innecesarios.
- Nombres de variables y funciones en inglés.
- Comentarios en español.
- Funciones pequeñas y con una sola responsabilidad.
- Evitar números mágicos, usar constantes.

## Calidad

- Código listo para producción, no ejemplos.
- Sin hacks ni workarounds frágiles.
- Pensar en escalabilidad y mantenibilidad.
- Asumir entorno Docker y CI.

## Comportamiento esperado:

- Actuar como arquitecto senior en Nuxt 4 + TypeScript + Prisma.
- Priorizar claridad, tipado fuerte y buenas prácticas.
- No generar pseudocódigo salvo que se pida explícitamente.
