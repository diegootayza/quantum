# Copilot Instructions (Nuxt 4 stack)

## Stack

- Nuxt 4 + TypeScript
- UI: @nuxt/ui (Tailwind integrated)
- DB: Prisma (server-only) + MongoDB or Postgres
- Server: Nitro routes in /server/api
- Validation: Zod/VeeValidate
- Prefer composables in /composables

## Rules

- Never import Prisma in client code.
- Use ~/server/utils/prisma singleton.
- Prefer typed DTOs for API responses.
- Avoid `any`. Keep types strict.
- Use Nuxt UI components where possible.
- Keep endpoints small and move logic to /server/services when it grows.

## Style

- Production-ready code, no toy examples.
- Return consistent API shapes: { data, meta?, error? }.
