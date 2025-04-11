FROM node:20-alpine AS base

# 設定工作目錄
WORKDIR /app

# 建置階段
FROM base AS builder
COPY package.json yarn.lock ./
COPY .yarn ./.yarn
COPY . .

# 安裝相依套件並構建專案
RUN corepack enable && \
    corepack prepare yarn@4.8.1 --activate && \
    yarn install && \
    yarn db:generate && \
    yarn build

# 執行階段
FROM base AS runner
ENV NODE_ENV=production
ENV HOST=0.0.0.0

# 確保非 root 使用者執行
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 appuser

# 複製必要檔案
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json

USER appuser

EXPOSE 3001

CMD ["node", "dist/main.js"]