# syntax=docker/dockerfile:1

FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
COPY docs-src/package*.json ./docs-src/
COPY apps ./apps
COPY docs-src ./docs-src
COPY packages ./packages
COPY scripts ./scripts

RUN npm ci --include=dev --include=optional
RUN node -e "require.resolve('@rolldown/binding-linux-x64-musl')" >/dev/null 2>&1 || npm install --no-save --no-package-lock --include=dev --include=optional @rolldown/binding-linux-x64-musl@1.0.0
RUN npm ci --prefix docs-src
RUN npm run anywaydata --prefix docs-src
RUN npm run build:web
RUN node ./scripts/merge-web-build-into-docs-build.js

FROM nginxinc/nginx-unprivileged:1.27-alpine
WORKDIR /usr/share/nginx/html

COPY --from=builder /app/build/ ./
