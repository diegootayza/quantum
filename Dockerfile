FROM oven/bun:1-alpine AS builder

ARG AI_GATEWAY_API_KEY=${AI_GATEWAY_API_KEY}
ENV AI_GATEWAY_API_KEY=${AI_GATEWAY_API_KEY}
ARG CAPROVER_GIT_COMMIT_SHA=${CAPROVER_GIT_COMMIT_SHA}
ENV CAPROVER_GIT_COMMIT_SHA=${CAPROVER_GIT_COMMIT_SHA}
ARG CONNECT_URL=${CONNECT_URL}
ENV CONNECT_URL=${CONNECT_URL}
ARG DATABASE_URL=${DATABASE_URL}
ENV DATABASE_URL=${DATABASE_URL}
ARG NUXT_SESSION_PASSWORD=${NUXT_SESSION_PASSWORD}
ENV NUXT_SESSION_PASSWORD=${NUXT_SESSION_PASSWORD}
ARG OPENAI_API_KEY=${OPENAI_API_KEY}
ENV OPENAI_API_KEY=${OPENAI_API_KEY}

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN bun install --frozen-lockfile

COPY prisma ./prisma

RUN bun prisma generate

COPY . .

RUN bun run build

FROM oven/bun:1-alpine AS runner

WORKDIR /app

COPY --from=builder /app/.output ./.output
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma

ENV HOST=0.0.0.0
ENV PORT=80
ENV NODE_ENV=production

EXPOSE 80

CMD ["bun", "run", ".output/server/index.mjs"]
