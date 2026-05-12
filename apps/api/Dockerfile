# syntax=docker/dockerfile:1
FROM node:22-alpine AS deps
WORKDIR /app
ENV HUSKY=0
RUN corepack enable && corepack prepare pnpm@11.1.1 --activate
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/core/package.json ./packages/core/package.json
COPY apps/api/package.json ./apps/api/package.json
RUN pnpm install --frozen-lockfile --prod --ignore-scripts --filter @anywaydata/api...

FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=deps /app/packages/core/node_modules ./packages/core/node_modules
COPY package.json ./package.json
COPY packages/core ./packages/core
COPY apps/api ./apps/api
EXPOSE 3000
CMD ["node", "apps/api/src/index.js"]


