# Build stage
FROM oven/bun:1-alpine AS builder

# Set build arguments and environment variables
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
ARG R2_ACCESS_KEY_ID=${R2_ACCESS_KEY_ID}
ENV R2_ACCESS_KEY_ID=${R2_ACCESS_KEY_ID}
ARG R2_BUCKET_NAME=${R2_BUCKET_NAME}
ENV R2_BUCKET_NAME=${R2_BUCKET_NAME}
ARG R2_ENDPOINT=${R2_ENDPOINT}
ENV R2_ENDPOINT=${R2_ENDPOINT}
ARG R2_SECRET_ACCESS_KEY=${R2_SECRET_ACCESS_KEY}
ENV R2_SECRET_ACCESS_KEY=${R2_SECRET_ACCESS_KEY}
ARG R2_URL=${R2_URL}
ENV R2_URL=${R2_URL}

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy prisma schema
COPY prisma ./prisma

# Generate Prisma Client
RUN bun prisma generate

# Copy application files
COPY . .

# Build the application
RUN bun run build

# Production stage
FROM oven/bun:1-alpine AS runner

WORKDIR /app

# Copy necessary files from builder
COPY --from=builder /app/.output ./.output
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma

# Create a non-root user
RUN addgroup --system --gid 1001 bunjs && \
    adduser --system --uid 1001 nuxtjs && \
    chown -R nuxtjs:bunjs /app

USER nuxtjs

# Expose port
EXPOSE 3000

# Set environment variables
ENV HOST=0.0.0.0
ENV PORT=3000
ENV NODE_ENV=production

# Start the application
CMD ["bun", "run", ".output/server/index.mjs"]
