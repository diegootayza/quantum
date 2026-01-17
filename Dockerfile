# Build stage
FROM node:22-alpine AS builder

# Set build arguments and environment variables
ARG AI_GATEWAY_API_KEY=${AI_GATEWAY_API_KEY}
ENV AI_GATEWAY_API_KEY=${AI_GATEWAY_API_KEY}
ARG DATABASE_URL=${DATABASE_URL}
ENV DATABASE_URL=${DATABASE_URL}
ARG NUXT_SESSION_PASSWORD=${NUXT_SESSION_PASSWORD}
ENV NUXT_SESSION_PASSWORD=${NUXT_SESSION_PASSWORD}
ARG R2_ACCESS_KEY_ID=${R2_ACCESS_KEY_ID}
ENV R2_ACCESS_KEY_ID=${R2_ACCESS_KEY_ID}
ARG R2_ENDPOINT=${R2_ENDPOINT}
ENV R2_ENDPOINT=${R2_ENDPOINT}
ARG R2_SECRET_ACCESS_KEY=${R2_SECRET_ACCESS_KEY}
ENV R2_SECRET_ACCESS_KEY=${R2_SECRET_ACCESS_KEY}
ARG R2_URL=${R2_URL}
ENV R2_URL=${R2_URL}
ARG AWS_REGION=${AWS_REGION}
ENV AWS_REGION=${AWS_REGION}
ARG AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}
ENV AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}
ARG AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}
ENV AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}
ARG CAPROVER_GIT_COMMIT_SHA=${CAPROVER_GIT_COMMIT_SHA}
ENV CAPROVER_GIT_COMMIT_SHA=${CAPROVER_GIT_COMMIT_SHA}

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy prisma schema
COPY prisma ./prisma

# Generate Prisma Client
RUN pnpm prisma generate

# Copy application files
COPY . .

# Build the application
RUN pnpm build

# Production stage
FROM node:22-alpine AS runner

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy necessary files from builder
COPY --from=builder /app/.output ./.output
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nuxtjs && \
    chown -R nuxtjs:nodejs /app

USER nuxtjs

# Expose port
EXPOSE 3000

# Set environment variables
ENV HOST=0.0.0.0
ENV PORT=3000
ENV NODE_ENV=production

# Start the application
CMD ["node", ".output/server/index.mjs"]
