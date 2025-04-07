# builder stage
FROM ubuntu:22.04 AS builder

RUN apt-get update && \
    apt-get install -y curl gnupg build-essential openssl && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# 安裝 nodejs 22.x
RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash - && \
    apt-get install -y nodejs && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# 啟用 corepack
RUN corepack enable && corepack prepare yarn@4.8.1 --activate

# 創建系統用戶組和用戶
RUN groupadd --system appgroup && \
    useradd --system --create-home --gid appgroup appuser

# 設置工作目錄
WORKDIR /home/appuser/app

# 設置全域 Yarn 快取路徑
ENV YARN_CACHE_FOLDER=/home/.yarn/berry/cache
RUN mkdir -p $YARN_CACHE_FOLDER && chown -R appuser:appgroup /home/.yarn

# 設置權限
RUN chown -R appuser:appgroup /home/appuser/app

# 切換到非 root 用戶
USER appuser

# 複製依賴相關文件
COPY --chown=appuser:appgroup package.json yarn.lock ./
COPY --chown=appuser:appgroup .yarn ./.yarn/
COPY --chown=appuser:appgroup .pnp.cjs .pnp.loader.mjs ./

# 安裝依賴
RUN yarn install --immutable && \
    yarn add -D @yarnpkg/pnpify && \
    yarn add prisma @prisma/client

# 複製所有檔案
COPY --chown=appuser:appgroup . ./

# 執行建置命令
RUN yarn db:generate
RUN yarn build


# ---------------------------------------
# Runner stage

FROM ubuntu:22.04 AS runner

RUN apt-get update && \
    apt-get install -y curl gnupg build-essential openssl netcat && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# 安裝 nodejs 22.x
RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash - && \
    apt-get install -y nodejs && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

RUN corepack enable && corepack prepare yarn@4.8.1 --activate

ENV NODE_ENV=production
ENV YARN_CACHE_FOLDER=/home/appuser/app/.yarn

RUN groupadd --system appgroup && \
    useradd --system --create-home --gid appgroup appuser

WORKDIR /home/appuser/app

# 從 builder 複製建立好的應用
COPY --from=builder /home/appuser/app/ ./

# 確保權限正確
RUN chown -R appuser:appgroup /home/appuser/app

USER appuser

EXPOSE 3002

CMD ["sh", "-c", "until nc -z mysql 3306; do echo '等待 MySQL 啟動中...'; sleep 2; done; yarn prisma migrate deploy && node dist/app.js"]