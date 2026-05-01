---
sidebar_position: 3
title: "REST API"
description: "Use the AnyWayData REST API locally or with Docker, including OpenAPI and Swagger."
---

The REST API is best for HTTP automation, service integration, and schema-driven tooling.

## When To Use This

- You need programmatic generation over HTTP.
- You want OpenAPI/Swagger documentation.
- You want per-format defaults managed via API endpoints.

## Quick Start

From the repo root of [grid-table-editor](https://github.com/eviltester/grid-table-editor):

```bash
npm run start --workspace @anywaydata/api
```

By default this starts on port `3000`, and yes, you can change the port with `--port` or `PORT` (see Local Run).

After startup, two useful docs endpoints are available:

- Swagger UI: `http://localhost:3000/docs`
- OpenAPI spec (JSON): `http://localhost:3000/openapi.json`

If you run on a different port, replace `3000` in those URLs.

What these are:

- Swagger UI is a browser-based, interactive API documentation page where you can explore endpoints and try requests.
- The OpenAPI spec is a machine-readable API contract (JSON) used by tooling for validation, client generation, and integrations.

Official references:

- Swagger UI official site: [https://swagger.io/tools/swagger-ui/](https://swagger.io/tools/swagger-ui/)
- OpenAPI Initiative (official): [https://www.openapis.org/](https://www.openapis.org/)
- OpenAPI Specification (official): [https://spec.openapis.org/oas/latest.html](https://spec.openapis.org/oas/latest.html)

Published package options:

```bash
npx -y @anywaydata/api
# or
npx -y anywaydata-api
```

Published package on a specific port:

```bash
npx -y @anywaydata/api --port 3001
# or
npx -y anywaydata-api --port 3001
```

## Local Run

Pick a specific port:

```bash
npm run start --workspace @anywaydata/api -- --port 3001
# or
node apps/api/src/index.js --port 3001
# or
npx -y @anywaydata/api --port 3001
```

PowerShell `PORT` example:

```powershell
$env:PORT=3001; npm run start --workspace @anywaydata/api
```

Port behavior:

- `--port` overrides `PORT`.
- If explicit port is in use, startup fails.
- If no explicit port is provided, it starts at `3000` and tries `3001..3020`.

## Docker Run

Build from the repo root of [grid-table-editor](https://github.com/eviltester/grid-table-editor):

```bash
docker build -f apps/api/Dockerfile -t anywaydata-api .
```

Run:

```bash
docker run --rm -p 8082:3000 anywaydata-api
```

Use endpoints at `http://localhost:8082`.

## Common Endpoints

- `GET /health`
  - Liveness check. Returns basic service status.
- `POST /v1/generate`
  - Main JSON endpoint for generation from a structured request body.
- `POST /v1/generate/fromschema`
  - Generation endpoint for raw text schema input (`text/plain`) plus query parameters.
- `GET /v1/generate/options/<format>`
  - Returns current export options for a format (for example `json`, `csv`, `python`).
- `POST /v1/generate/options/<format>`
  - Sets export options for a format.
- `POST /v1/generate/options/<format>/default`
  - Resets a format’s options back to defaults.
- `GET /openapi.json`
  - Returns the OpenAPI document for tooling and code generation.
- `GET /docs`
  - Serves Swagger UI so you can inspect and try endpoints interactively.

## Generate vs FromSchema

- `POST /v1/generate` is best when your caller already sends JSON.
  - Request includes `textSpec`, `rowCount`, `outputFormat`, and optional `options` in one JSON payload.
  - Better for typed clients, backend services, and standard REST workflows.
- `POST /v1/generate/fromschema` is best when your source schema is raw text.
  - Send the schema body as `text/plain`.
  - Pass controls like `rowCount` and `outputFormat` as query parameters.
  - Useful for CLI-like flows or quick text-based integrations.

Both endpoints generate data from the same schema language and output formats. The key difference is request shape and content type, not generation capability.

## API Examples

Health check:

```bash
curl http://localhost:3000/health
```

Generate JSON output with a JSON payload:

```bash
curl -X POST http://localhost:3000/v1/generate \
  -H "Content-Type: application/json" \
  -d '{
    "textSpec": "Name\nBob\n\nCity\nlondon",
    "rowCount": 3,
    "outputFormat": "json"
  }'
```

Generate CSV output with CSV-specific options:

```bash
curl -X POST http://localhost:3000/v1/generate \
  -H "Content-Type: application/json" \
  -d '{
    "textSpec": "Name\nBob",
    "rowCount": 2,
    "outputFormat": "csv",
    "options": {
      "quotes": true,
      "header": true,
      "quoteChar": "\"",
      "escapeChar": "\""
    }
  }'
```

Generate using raw schema text (`fromschema`):

```bash
curl -X POST "http://localhost:3000/v1/generate/fromschema?outputFormat=markdown&rowCount=2" \
  -H "Content-Type: text/plain" \
  --data-binary $'Name\nBob\n\nId\n1'
```

Get current options for a format:

```bash
curl http://localhost:3000/v1/generate/options/json
```

Set options for a format:

```bash
curl -X POST http://localhost:3000/v1/generate/options/json \
  -H "Content-Type: application/json" \
  -d '{
    "options": {
      "prettyPrint": true,
      "prettyPrintDelimiter": 2,
      "makeNumbersNumeric": true
    }
  }'
```

Reset format options to defaults:

```bash
curl -X POST http://localhost:3000/v1/generate/options/json/default
```

OpenAPI and Swagger docs:

```bash
curl http://localhost:3000/openapi.json
# and open in browser:
# http://localhost:3000/docs
```

## Notes

- If you run on a non-default port, replace `3000` in all examples.
- For MCP tool integrations, see [MCP](/docs/interfaces-and-deployment/mcp).
