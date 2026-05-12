# syntax=docker/dockerfile:1

FROM node:20-alpine AS builder
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@10.19.0 --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps ./apps
COPY packages ./packages

RUN pnpm install --frozen-lockfile
RUN node -e "require.resolve('@rolldown/binding-linux-x64-musl')" >/dev/null 2>&1 || pnpm add -Dw @rolldown/binding-linux-x64-musl@1.0.0
RUN pnpm run build:web

FROM nginx:1.27-alpine
WORKDIR /usr/share/nginx/html

# Serve the built browser app only (no docs-src / docusaurus build pipeline)
COPY --from=builder /app/apps/web/dist/ ./


