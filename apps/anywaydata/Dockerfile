FROM node:22-alpine AS builder
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@11.1.1 --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY docs-src/package.json ./docs-src/
COPY apps ./apps
COPY docs-src ./docs-src
COPY packages ./packages
COPY scripts ./scripts

ENV HUSKY=0
RUN pnpm install --frozen-lockfile --ignore-scripts
RUN pnpm rebuild esbuild unrs-resolver
RUN node -e "require.resolve('@rolldown/binding-linux-x64-musl')" >/dev/null 2>&1 || (pnpm install --force --frozen-lockfile --ignore-scripts --config.minimumReleaseAge=0 && pnpm rebuild esbuild unrs-resolver && node -e "require.resolve('@rolldown/binding-linux-x64-musl')")
RUN pnpm --dir docs-src run anywaydata
RUN pnpm run build:web
RUN node ./scripts/merge-web-build-into-docs-build.js

FROM nginxinc/nginx-unprivileged:1.27-alpine
WORKDIR /usr/share/nginx/html

COPY --from=builder /app/build/ ./
