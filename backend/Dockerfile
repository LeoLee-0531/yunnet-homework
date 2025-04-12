FROM node:20-alpine AS base

# 設定工作目錄
WORKDIR /app

# 啟用 Corepack
RUN corepack enable

# 確保非 root 使用者執行
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 appuser && \
    chown -R appuser:nodejs /app

# 建置階段
FROM base AS builder

COPY --chown=appuser:nodejs package.json yarn.lock ./
RUN yarn install
COPY --chown=appuser:nodejs . .

RUN yarn db:generate && \
    yarn build 

# 執行階段
FROM base AS runner
ENV NODE_ENV=production

# 複製必要檔案
COPY --from=builder --chown=appuser:nodejs /app/prisma ./prisma
COPY --from=builder --chown=appuser:nodejs /app/dist ./dist
COPY --from=builder --chown=appuser:nodejs /app/package.json ./package.json

RUN yarn install

EXPOSE 3001

CMD ["yarn", "node", "dist/main.js"]