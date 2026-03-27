FROM node:20-alpine AS base
RUN npm install -g pnpm

FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/ ./packages/
COPY apps/platform/package.json ./apps/platform/
RUN pnpm install --frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages ./packages
COPY . .
RUN pnpm turbo build --filter=@homebase/platform

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/apps/platform/.next/standalone ./
COPY --from=builder /app/apps/platform/.next/static ./apps/platform/.next/static
COPY --from=builder /app/apps/platform/public ./apps/platform/public
EXPOSE 3006
CMD ["node", "apps/platform/server.js"]
