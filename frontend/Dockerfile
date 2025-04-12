FROM node:20-alpine AS base

# 設定工作目錄
WORKDIR /app/

# 建立非 root 使用者
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs && \
    chown -R nextjs:nodejs /app

# 啟用 Corepack
RUN corepack enable

# 切換到 nextjs 使用者
USER nextjs

# 建置階段
FROM base AS builder

# 複製檔案並確保所有權
COPY --chown=nextjs:nodejs package.json yarn.lock ./
RUN yarn install
COPY --chown=nextjs:nodejs . .

RUN yarn build

# 執行階段
FROM base AS runner
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# 複製必要檔案並確保權限
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/.yarn ./.yarn
COPY --from=builder --chown=nextjs:nodejs /app/.pnp.cjs /app/.pnp.loader.mjs /app/package.json /app/yarn.lock ./

RUN yarn install

EXPOSE 3000

CMD ["yarn", "start"]
