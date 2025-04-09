# 構建階段
FROM node:22-alpine AS builder

# 更新系統並安裝安全補丁
RUN apk update && apk upgrade && \
    rm -rf /var/cache/apk/*

# 設定工作目錄
WORKDIR /app

# 安裝 yarn 4.8.1
RUN corepack enable && corepack prepare yarn@4.8.1 --activate

# 複製 package.json、yarn.lock 和 Yarn 相關文件
COPY package.json yarn.lock ./
COPY .yarn ./.yarn

# 安裝依賴
RUN yarn install

# 複製其餘源代碼
COPY . .

# 構建應用
RUN yarn build

# 執行階段
FROM node:22-alpine AS runner

# 更新系統並安裝安全補丁
RUN apk update && apk upgrade && \
    rm -rf /var/cache/apk/*

WORKDIR /app

# 安裝 yarn 4.8.1
RUN corepack enable && corepack prepare yarn@4.8.1 --activate

# 設定為生產環境
ENV NODE_ENV=production

# 複製必要文件
COPY --from=builder /app/package.json /app/yarn.lock ./
COPY --from=builder /app/.yarn ./.yarn
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules

# 設置使用者權限安全性
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs && \
    chown -R nextjs:nodejs /app
USER nextjs

# 暴露埠號
EXPOSE 3000

# 啟動命令
CMD ["yarn", "start"]
