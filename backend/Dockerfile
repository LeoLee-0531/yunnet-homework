FROM node:20.0-alpine AS builder

WORKDIR /app

# 複製相依性檔案
COPY package.json yarn.lock ./
RUN yarn install

# 複製源碼並建構
COPY . .
RUN yarn db:generate && \
    yarn build

# 執行階段映像檔
FROM node:20.0-alpine AS runner

WORKDIR /app

# 添加環境變數
ENV NODE_ENV=production

# 建立非 root 用戶
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# 從建構階段複製依賴項和建構後的應用程式
COPY --from=builder --chown=appuser:appgroup /app/package.json ./
COPY --from=builder --chown=appuser:appgroup /app/yarn.lock ./
COPY --from=builder --chown=appuser:appgroup /app/.yarn ./.yarn
COPY --from=builder --chown=appuser:appgroup /app/.pnp.* ./
COPY --from=builder --chown=appuser:appgroup /app/prisma ./prisma
COPY --from=builder --chown=appuser:appgroup /app/dist ./dist

# 安裝生產環境依賴
RUN yarn install --production

USER appuser

EXPOSE 3001

CMD ["node", "dist/app.js"]