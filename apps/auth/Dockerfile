FROM node:20-alpine AS base
RUN npm install -g pnpm

FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/ ./packages/
COPY apps/auth/package.json ./apps/auth/
RUN pnpm install --frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages ./packages
COPY . .
RUN pnpm turbo build --filter=@homebase/auth

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/apps/auth/.next/standalone ./
COPY --from=builder /app/apps/auth/.next/static ./apps/auth/.next/static
COPY --from=builder /app/apps/auth/public ./apps/auth/public
EXPOSE 3001
CMD ["node", "apps/auth/server.js"]
