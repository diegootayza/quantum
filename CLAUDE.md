# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

```bash
pnpm install          # Install dependencies
pnpm dev              # Start dev server (runs prisma db push first)
pnpm build            # Production build (runs prisma db push first)
pnpm preview          # Preview production build
```

## Architecture Overview

Quantum is a full-stack AI conversation platform built with Nuxt 4, featuring role-based user management (USER/ADMIN), and multi-model AI integration through the Vercel AI SDK gateway.

### Directory Structure

- `/app/` - Frontend Nuxt application (pages, components, composables, middleware)
- `/server/` - Backend API routes and utilities
- `/prisma/` - Database schema (MongoDB with Prisma ORM)
- `/shared/` - Shared types and Zod validation schemas

### API Route Patterns

Routes use Nuxt file-based routing with HTTP method suffixes:

- `/server/api/[resource]/index.[method].ts` - Collection endpoints
- `/server/api/[resource]/[id].[method].ts` - Individual resource endpoints
- Admin routes under `/server/api/dashboard/` require ADMIN role

Standard API handler structure:

```typescript
export default defineEventHandler(async (event) => {
    const { user } = await requireUserSession(event)
    const data = await readValidatedBody(event, schema.parse)

    return processError(async () => {
        return await prisma.resource.create({ data })
    })
})
```

### Authentication & Middleware

Uses `nuxt-auth-utils` with HTTP-only cookie sessions. Middleware in `/app/middleware/`:

- `auth.ts` - Requires login
- `admin.ts` - Requires ADMIN role
- `guest.ts` - Redirects logged-in users
- `active.ts` - Requires active subscription

Apply via `definePageMeta({ middleware: ['auth', 'active'] })`.

### Key Server Utilities (`/server/utils/`)

- `prisma.ts` - Singleton Prisma client
- `storage.ts` - Cloudflare R2 file storage (`storageUpload`, `storageDelete`)
- `error.ts` - Prisma error mapping to HTTP responses with Spanish messages
- `setting.ts` - Configuration retrieval (`getSettingValue`)
- `tool.ts` - AI tools for image generation

### Key Composables (`/app/composables/`)

- `useModels()` - AI model selection (cookie-persisted)
- `useConfirmModal()` / `useInputModal()` - Modal state management
- `useSafeError()` - Error handling with toast notifications
- `useSpeech()` - Web Speech API integration (Spanish es-ES)
- `useHighlighter()` - Shiki code syntax highlighting

### Data Models (Prisma)

Primary entities: User, Conversation, Message, Instruction, Category, Attachment, Setting. User roles are USER or ADMIN. Messages store content in `parts` (Json array).

### AI Integration

Multi-provider via Vercel AI SDK gateway (`@ai-sdk/gateway`). Models configured in `useModels()` composable. Conversation streaming uses `createUIMessageStream` with `streamText`. Tool support includes image generation via Gemini.

### Validation

Zod schemas in `/shared/utils/schemas.ts` are used for both frontend forms and backend API validation.

### Code Style (ESLint enforced)

- **Alphabetical sorting**: Imports, object keys, props, interfaces must be sorted alphabetically (perfectionist plugin)
- **Vue attributes**: Use camelCase (no hyphens), e.g., `@modelUpdate` not `@model-update`
- **Self-closing tags**: Always use self-closing for components `<MyComponent />`
- **Object shorthand**: Required, e.g., `{ name }` not `{ name: name }`
- **Unused variables**: Prefix with `_` to ignore, e.g., `_unused`

### Language

All user-facing messages, form validation, and error messages are in Spanish. Code and comments are in English.
