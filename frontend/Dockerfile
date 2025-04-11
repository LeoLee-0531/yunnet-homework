FROM node:20-alpine AS base

# 設定工作目錄
WORKDIR /app

# 啟用 Corepack 並準備正確版本的 Yarn
RUN corepack enable && corepack prepare yarn@4.8.1 --activate

# 安裝依賴階段
FROM base AS deps
COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn ./.yarn
RUN yarn install

# 建置階段
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN yarn build

# 執行階段
FROM base AS runner
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOST=0.0.0.0

# 確保非 root 使用者執行
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

USER nextjs

EXPOSE 3000

# 修改啟動命令，使用 next start 而非直接 node
CMD ["npx", "next", "start", "-p", "3000", "-H", "0.0.0.0"]
