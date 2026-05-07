# syntax=docker/dockerfile:1
FROM node:20-alpine AS deps
WORKDIR /app
ENV HUSKY=0
COPY package.json package-lock.json ./
COPY packages/core/package.json ./packages/core/package.json
COPY apps/api/package.json ./apps/api/package.json
RUN npm ci --omit=dev --ignore-scripts

FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY package.json ./package.json
COPY packages/core ./packages/core
COPY apps/api ./apps/api
EXPOSE 3000
CMD ["node", "apps/api/src/index.js"]
