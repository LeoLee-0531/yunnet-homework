FROM node:20.0-alpine AS builder

# 更新系統並安裝安全補丁
RUN apk update && apk upgrade && \
    rm -rf /var/cache/apk/*

# 設定工作目錄
WORKDIR /app

# 安裝 yarn 4.8.1
RUN corepack enable && corepack prepare yarn@4.8.1 --activate

# 複製相依性檔案
COPY package.json yarn.lock ./

# 安裝依賴
RUN yarn install

# 複製源碼並建構
COPY . .

# 構建應用
RUN yarn db:generate && \
    yarn build

# 執行階段映像檔
FROM node:20.0-alpine AS runner

# 更新系統並安裝安全補丁
RUN apk update && apk upgrade && \
    rm -rf /var/cache/apk/*

WORKDIR /app

RUN corepack enable && corepack prepare yarn@4.8.1 --activate

# 添加環境變數
ENV NODE_ENV=production

# 建立非 root 用戶
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# 從建構階段複製依賴項和建構後的應用程式
COPY --from=builder --chown=appuser:appgroup /app/package.json /app/yarn.lock ./
COPY --from=builder --chown=appuser:appgroup /app/.yarn ./.yarn
COPY --from=builder --chown=appuser:appgroup /app/.pnp.* ./
COPY --from=builder --chown=appuser:appgroup /app/prisma ./prisma
COPY --from=builder --chown=appuser:appgroup /app/dist ./dist

# 安裝生產環境依賴
RUN yarn install --production

USER appuser

EXPOSE 3001

CMD ["node", "dist/app.js"]