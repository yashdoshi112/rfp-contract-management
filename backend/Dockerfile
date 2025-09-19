FROM node:20-slim
WORKDIR /app

# System deps for Prisma engines (openssl & CA certs)
RUN apt-get update && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

# Install deps (including devDeps for tsc/prisma)
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./
RUN if [ -f pnpm-lock.yaml ]; then corepack enable && corepack prepare pnpm@9 --activate && pnpm install --frozen-lockfile; \
    elif [ -f yarn.lock ]; then yarn install --frozen-lockfile; \
    elif [ -f package-lock.json ]; then npm ci; \
    else npm install; fi

# Copy source
COPY . .

# Generate Prisma client & build TS
RUN npx prisma generate
RUN npm run build

# Run DB migrations at startup, then launch
COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh

EXPOSE 4000
CMD ["sh", "/app/start.sh"]
