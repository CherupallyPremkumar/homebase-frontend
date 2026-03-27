FROM node:20-alpine AS base
RUN npm install -g pnpm

FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/ ./packages/
COPY apps/finance/package.json ./apps/finance/
RUN pnpm install --frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages ./packages
COPY . .
RUN pnpm turbo build --filter=@homebase/finance

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/apps/finance/.next/standalone ./
COPY --from=builder /app/apps/finance/.next/static ./apps/finance/.next/static
COPY --from=builder /app/apps/finance/public ./apps/finance/public
EXPOSE 3000
CMD ["node", "apps/finance/server.js"]
