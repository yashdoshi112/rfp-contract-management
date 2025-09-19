FROM node:20-slim
WORKDIR /app

# Install deps (including devDeps so prisma/tsc exist)
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./
RUN if [ -f pnpm-lock.yaml ]; then \
      corepack enable && corepack prepare pnpm@9 --activate && pnpm install --frozen-lockfile; \
    elif [ -f yarn.lock ]; then \
      yarn install --frozen-lockfile; \
    elif [ -f package-lock.json ]; then \
      npm ci; \
    else \
      npm install; \
    fi

# Copy source
COPY . .

# Generate Prisma client and build
RUN npx prisma generate
RUN npm run build || pnpm build || yarn build

# Small entry to run DB migrations each start
COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh

EXPOSE 4000
CMD ["sh", "/app/start.sh"]
