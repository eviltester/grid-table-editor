# syntax=docker/dockerfile:1

FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
COPY apps ./apps
COPY packages ./packages

RUN npm ci
RUN npm run build:web

FROM nginx:1.27-alpine
WORKDIR /usr/share/nginx/html

# Serve the built browser app only (no docs-src / docusaurus build pipeline)
COPY --from=builder /app/apps/web/dist/ ./
