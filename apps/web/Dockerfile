# syntax=docker/dockerfile:1

FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
COPY apps ./apps
COPY packages ./packages

RUN npm ci --include=dev --include=optional
RUN node -e "require.resolve('@rolldown/binding-linux-x64-musl')" >/dev/null 2>&1 || npm install --no-save --no-package-lock --include=dev --include=optional @rolldown/binding-linux-x64-musl@1.0.0
RUN npm run build:web

FROM nginx:1.27-alpine
WORKDIR /usr/share/nginx/html

# Serve the built browser app only (no docs-src / docusaurus build pipeline)
COPY --from=builder /app/apps/web/dist/ ./
