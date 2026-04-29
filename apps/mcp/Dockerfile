# syntax=docker/dockerfile:1
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
COPY packages/core/package.json ./packages/core/package.json
COPY apps/mcp/package.json ./apps/mcp/package.json
RUN npm ci --omit=dev

FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY package.json ./package.json
COPY packages/core ./packages/core
COPY js ./js
COPY apps/mcp ./apps/mcp
CMD ["node", "apps/mcp/src/index.js"]
