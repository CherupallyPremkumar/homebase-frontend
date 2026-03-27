FROM node:20-alpine AS base
RUN npm install -g pnpm

FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/ ./packages/
COPY apps/seller/package.json ./apps/seller/
RUN pnpm install --frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages ./packages
COPY . .
RUN pnpm turbo build --filter=@homebase/seller

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/apps/seller/.next/standalone ./
COPY --from=builder /app/apps/seller/.next/static ./apps/seller/.next/static
COPY --from=builder /app/apps/seller/public ./apps/seller/public
EXPOSE 3000
CMD ["node", "apps/seller/server.js"]
