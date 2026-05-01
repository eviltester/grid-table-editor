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

From the repo root of [grid-table-editor](https://github.com/eviltester/grid-table-editor), start a static web server and open the pages.

```bash
python3 -m http.server
```

Then open:

- `http://localhost:8000/app.html`
- `http://localhost:8000/generator.html`

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

- The Web image serves static app assets.
- API endpoints are documented in [REST API](/docs/interfaces-and-deployment/rest-api).
