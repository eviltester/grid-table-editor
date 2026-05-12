---
sidebar_position: 2
title: "Web UI"
description: "Run AnyWayData Web UI on anywaydata.com, locally, or in Docker."
---

The Web UI is best for interactive editing, import/export, and conversion.

## When To Use This

- You want to edit table data in a grid.
- You want quick format conversion with visual previews.
- You want generated/exported data without writing code.

## Quick Start (Hosted)

- Main app: [https://anywaydata.com/app.html](https://anywaydata.com/app.html)
- Generator: [https://anywaydata.com/generator.html](https://anywaydata.com/generator.html)

## Local Run

From the repo root of [grid-table-editor](https://github.com/eviltester/grid-table-editor), install dependencies and start the Vite dev server.

```bash
pnpm install
pnpm run dev:web
```

Then open:

- `http://127.0.0.1:4173/`
- `http://127.0.0.1:4173/app.html`
- `http://127.0.0.1:4173/generator.html`

## Docker Run

Build from the repo root of [grid-table-editor](https://github.com/eviltester/grid-table-editor):

```bash
docker build -f apps/web/Dockerfile -t anywaydata-web .
```

Run:

```bash
docker run --rm -p 8080:80 anywaydata-web
```

Open:

- `http://localhost:8080/`
- `http://localhost:8080/app.html`
- `http://localhost:8080/generator.html`

## Notes

- The Docker image uses a multi-stage build:
- Node builds the web app with `pnpm run build:web`.
- Nginx serves the built static files from `apps/web/dist`.
- API endpoints are documented in [REST API](/docs/interfaces-and-deployment/rest-api).

