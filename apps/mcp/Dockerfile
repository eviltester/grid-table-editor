# syntax=docker/dockerfile:1
FROM node:20-alpine AS deps
WORKDIR /app
ENV HUSKY=0
RUN corepack enable && corepack prepare pnpm@10.19.0 --activate
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/core/package.json ./packages/core/package.json
COPY apps/mcp/package.json ./apps/mcp/package.json
RUN pnpm install --frozen-lockfile --prod --ignore-scripts --filter @anywaydata/mcp...

FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY package.json ./package.json
COPY packages/core ./packages/core
COPY apps/mcp ./apps/mcp
CMD ["node", "apps/mcp/src/index.js"]

