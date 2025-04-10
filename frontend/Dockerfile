# 構建階段
FROM node:20.12-alpine AS builder

# 更新系統並安裝安全補丁
RUN apk update && apk upgrade && \
    rm -rf /var/cache/apk/*

# 設定工作目錄
WORKDIR /app

# 安裝 yarn 4.8.1
RUN corepack enable && corepack prepare yarn@4.8.1 --activate

# 複製 package.json、yarn.lock 和 Yarn 相關文件
COPY package.json yarn.lock ./

# 安裝依賴
RUN yarn install --immutable

# 複製其餘源代碼
COPY . .

# 構建應用
RUN yarn build

# 執行階段
FROM node:20.12-alpine AS runner

# 更新系統並安裝安全補丁
RUN apk update && apk upgrade && \
    rm -rf /var/cache/apk/*

# 在 runner 階段
RUN apk add --no-cache wget

WORKDIR /app

RUN corepack enable && corepack prepare yarn@4.8.1 --activate

# 設定為生產環境
ENV NODE_ENV=production

# 建立非 root 用戶
RUN addgroup -S nodejs && adduser -S nextjs -G nodejs

# 設置使用者權限安全性
RUN chown -R nextjs:nodejs /app

# 複製必要文件
COPY --from=builder --chown=nextjs:nodejs /app/package.json /app/yarn.lock /app/.yarn ./
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next

# 考慮在 runner 階段增加，可減少不必要的開發依賴
RUN yarn workspaces focus --all --production

USER nextjs

EXPOSE 3000

# 健康檢查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

CMD ["yarn", "start"]
