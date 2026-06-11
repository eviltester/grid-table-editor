FROM node:22-alpine AS builder
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@11.1.1 --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps ./apps
COPY packages ./packages

RUN pnpm install --frozen-lockfile
RUN node -e "require.resolve('@rolldown/binding-linux-x64-musl')" >/dev/null 2>&1 || (pnpm install --force --frozen-lockfile --config.minimumReleaseAge=0 && node -e "require.resolve('@rolldown/binding-linux-x64-musl')")
RUN pnpm run build:web

FROM nginx:1.27-alpine
WORKDIR /usr/share/nginx/html

# Serve the built browser app only (no docs-src / docusaurus build pipeline)
COPY --from=builder /app/apps/web/dist/ ./

