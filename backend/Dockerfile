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
# 修正建置命令的語法錯誤
RUN yarn db:generate && \
    yarn build 

# 執行階段
FROM base AS runner
ENV NODE_ENV=production
ENV HOST=0.0.0.0

# 確保非 root 使用者執行
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 appuser

# 複製必要檔案
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json

USER appuser

EXPOSE 3001

CMD ["node", "dist/main.js"]