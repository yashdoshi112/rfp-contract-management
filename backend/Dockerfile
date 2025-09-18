# backend/Dockerfile
FROM node:18-slim
WORKDIR /app
COPY package.json pnpm-lock.yaml* package-lock.json* yarn.lock* ./
RUN if [ -f pnpm-lock.yaml ]; then corepack enable && corepack prepare pnpm@latest --activate && pnpm i --frozen-lockfile; \
    elif [ -f yarn.lock ]; then yarn --frozen-lockfile; \
    else npm i --omit=dev; fi
COPY . .
RUN npx prisma generate && npm run build || pnpm build || yarn build
EXPOSE 4000
CMD ["node", "dist/index.js"]
