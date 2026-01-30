# Copilot Instructions

- **Stack**: Nuxt 4 full-stack app with Nitro (bun preset in production), Pinia, @nuxt/ui, and MDC; backend HTTP routes live in `/server/api` with file-based `[name].[method].ts` handlers; Mongo via Prisma (`@prisma/client`). See [nuxt.config.ts](nuxt.config.ts).
- **Run it**: `pnpm install`, then `pnpm dev` (runs `prisma db push` first). Production: `pnpm build` → `pnpm preview`. Postinstall runs `nuxt prepare` for type generation. Scripts live in [package.json](package.json).
- **Auth & middleware**: `nuxt-auth-utils` session cookies; apply middleware via `definePageMeta({ middleware: [...] })`. Auth/role/subscription guards in [app/middleware](app/middleware).
- **Validation**: Shared Zod schemas for CRUD forms and API bodies in [shared/utils/schemas.ts](shared/utils/schemas.ts); use `readValidatedBody` / `getValidatedRouterParams` with these schemas inside API handlers.
- **Error handling**: Wrap Prisma calls with `processError` from [server/utils/error.ts](server/utils/error.ts) to return Spanish HTTP errors instead of raw exceptions.
- **Database models**: Core entities include Conversation, Message (stores `parts` JSON array), Attachment, Instruction, Prompt, Setting, User (roles ADMIN/USER). Prisma schema under [prisma/schema.prisma](prisma/schema.prisma).
- **AI pipeline**: Conversation replies stream via `createUIMessageStream` + `streamText` and `gateway(model)` in [server/api/conversation/[id].post.ts](server/api/conversation/%5Bid%5D.post.ts); system prompt injects user name and optional instruction; reasoning options tuned for OpenAI provider.
- **Conversation creation**: File uploads accepted via multipart in [server/api/conversation/index.post.ts](server/api/conversation/index.post.ts); images stored to R2, attachments persisted, initial user message recorded before streaming.
- **Image tool**: `toolGenerateImage` in [server/utils/tool.ts](server/utils/tool.ts) calls OpenAI image generation, stores PNGs to R2, and writes heartbeat events to keep the stream alive.
- **Prompts**: System prompt strings are fetched from DB via [server/utils/prompt.ts](server/utils/prompt.ts) (`conversation-title` used to auto-name threads when empty).
- **Settings**: Config values pulled from DB by [server/utils/setting.ts](server/utils/setting.ts); external service calls use [server/utils/connect.ts](server/utils/connect.ts) with `CONNECT_URL`.
- **Models & UI defaults**: `useModels()` in [app/composables/useModels.ts](app/composables/useModels.ts) exposes allowed model list (ADMIN gets `openai/gpt-5.2`, default cookie `model` set accordingly).
- **UX helpers**: Use `safeExecute` from [app/composables/useSafeError.ts](app/composables/useSafeError.ts) to surface errors via toasts; confirm/input/image modal composables live in [app/composables](app/composables).
- **Storage**: Cloudflare R2 via S3 client in [server/utils/storage.ts](server/utils/storage.ts); helper returns public URL and records size/mime. Deleting uses `storageDelete` with stored key.
- **Frontend structure**: Pages under [app/pages](app/pages) with layouts in [app/layouts](app/layouts); components grouped by feature (chat, dashboard, conversation, modal, select, table). Use self-closing tags and camelCase props/events per ESLint rules.
- **State**: Pinia store examples in [app/stores](app/stores); persistence via `pinia-plugin-persistedstate` when needed.
- **Styling**: Global CSS at [app/assets/css/main.css](app/assets/css/main.css); tailwindcss used through Vite plugin (no Tailwind config file—uses preset).
- **Language**: All user-facing copy and validation errors are in Spanish; keep code/comments in English unless string shown to users.
  switches to bun when `NODE_ENV=production`.
- **API pattern to follow**: `requireUserSession(event)` for auth, validate input with Zod helpers, wrap Prisma mutations in `processError`, persist messages to `conversationMessage` before streaming, and return `createUIMessageStreamResponse` for chat endpoints.
- **Conventions (ESLint)**: Alphabetical imports/props/object keys (perfectionist), camelCase Vue attributes, object shorthand required, self-closing Vue tags, prefix unused vars with `_`.
- **Internationalization**: Validation and error responses must stay Spanish; do not mix languages in UI strings.

Please review and let me know if any sections are unclear or missing project-specific details to add.
