[![Node.js CI](https://github.com/eviltester/grid-table-editor/actions/workflows/node.js.yml/badge.svg)](https://github.com/eviltester/grid-table-editor/actions/workflows/node.js.yml)

[![Wallaby.js](https://img.shields.io/badge/wallaby.js-powered-blue.svg?style=flat&logo=github)](https://wallabyjs.com/oss/)

# Data Grid Table Editor and Data Generator

A simple Data Table Editor that generates Markdown, CSV or JSON. It can also be used to interchange data between the formats, supporting editing in the grid.

- Grid interface
- drag and drop rows to re-order
- drag and drop columns to re-order
- import csv from file
- import csv, markdown, and json from editor
- generate csv, markdown, json and javascript from grid
- export csv, markdown and json files
- add and delete columns
- add and delete rows
- randomly fill data with Test Data
- configure export options

---

## Use The Editor

The application is live at [AnyWayData.com](https://anywaydata.com)

- Or clone and run locally by opening index.html in a browser after starting a web server in the folder e.g. `python3 -m http.server`

### Select Grid Engine

The editor can run with AG Grid or Tabulator using the same import/export and toolbar processing layer.

- Query string: `?grid=ag-grid` or `?grid=tabulator`
- Global override before app load: `window.ANYWAYDATA_GRID_ENGINE = "ag-grid"`
- Persisted setting key: `localStorage["anywaydata:grid-engine"]`

Default is Tabulator.

## To Generate Test Data

Use the Generator to create test data rules using a nicer UI.

You can preview the data prior to generating.

You can copy the schema into the editor UI and use it to populate existing tables.

## To Generate Test Data in an Grid

You can add data to an existing data table e.g. you import a CSV file and want to a new column of dates, or you want to amend an entire column (perhaps to obfuscate PII Data)

Expand the "> Test Data" section.

Choose the Data fields to add or amend in the table or enter a spec.

You can then create a new table, or amend the existing table or selected rows.

## Test Data Text Spec

The spec is a paragraph of text where each line is either a 'name' or a 'rule':

```
name
rule
name
rule
```

- `name` will be used as a column name
- `rule` will be used to generate the data

A `rule` can be a regex string e.g.

- `(connie|bob)` which would generate 'connie' or 'bob'
- `[1-9][0-9]{0,4}` which would generate number between 1 and 99999

A `rule` can also be a faker API call.

Faker API can be found here: https://fakerjs.dev/api/

e.g.

- `faker.person.firstName`
- `faker.hacker.noun`

The `faker` prefix is optional:

e.g.

- `person.firstName`
- `hacker.noun`

The `fake` method is also supported, which takes a mustache template style string combining api methods e.g.

- `helpers.fake("{{name.lastName}}, {{name.firstName}}")`

So a sample test data spec might look like:

```
name
helpers.fake("{{name.lastName}}, {{name.firstName}}")
desc
faker.lorem.paragraph
collects
hacker.noun
prefers
(Connie|Bob)
```

## Similar Apps

Looking for similar apps to compare features sets and functionality?

There is a maintained list in the documentation:

- [Related Tools](https://anywaydata.com/docs/misc/related_tools)

## References

- [Markdown Tables Extended Syntax](https://www.markdownguide.org/extended-syntax/#tables)

## Libraries Used

- [Faker.js](http://marak.github.io/faker.js) for domain api
  - http://marak.github.io/faker.js
- [RandExp.js](http://fent.github.io/randexp.js/) for regular expression based random data generation
  - http://fent.github.io/randexp.js/
- [Tabulator](https://tabulator.info/) for light weight tables
- [PapaParse](https://www.papaparse.com/) for csv processing

## Tool Categories

This tool falls in to the categories:

- online markdown editor
- markdown table generator
- markdown table editor
- Online Test Data Generation
- Online CSV Editor

## Building

Test - `npm test`

Coverage - `npm run testcoverage`

Preview Docs - `npm run previewdocs`

Build for release - `npm run anywaydata:win`

## Monorepo Workspaces

This repository now uses npm workspaces:

- `packages/core` -> shared generation engine (`@anywaydata/core`)
- `packages/cli` -> CLI wrapper (`@anywaydata/cli`)
- `apps/api` -> REST API (`@anywaydata/api`)
- `apps/mcp` -> MCP server (`@anywaydata/mcp`)

Install all dependencies from the repo root:

`npm install`

Run workspace build/test orchestration from root:

- `npm run build:workspaces`
- `npm run test:workspaces`

Run an individual workspace command:

- `npm run test --workspace @anywaydata/core`
- `npm run start --workspace @anywaydata/api`
- `npm run start --workspace @anywaydata/mcp`

## REST API Quick Start

Start the API:

`npm run start --workspace @anywaydata/api`

Choose a specific port:

- `npm run start --workspace @anywaydata/api -- --port 3001`
- PowerShell: `$env:PORT=3001; npm run start --workspace @anywaydata/api`

Port behavior:

- `--port` overrides `PORT`
- if a port is explicitly provided (`--port` or `PORT`) and is in use, startup fails with a short message
- if no explicit port is provided, API starts at `3000` and auto-tries `3001..3020` when needed

Health check:

`GET http://localhost:3000/health`

Generate data:

`POST http://localhost:3000/v1/generate`

`/v1/generate` request supports optional `responseFormat` mode:

- `responseFormat: "rows"` (default) returns `headers` + `rows`
- `responseFormat: "rendered"` returns only rendered text in JSON payload
- `responseFormat: "all"` returns `headers` + `rows` + `rendered`
- `responseFormat: "raw"` returns rendered payload directly with content-type matching output format
- `outputFormat` is optional and defaults to `csv`
- `outputFormat` supports: `csv`, `dsv`, `markdown`, `json`, `jsonl`, `javascript`, `python`, `java`, `typescript`, `xml`, `sql`, `gherkin`, `html`, `asciitable`

Raw multiline schema/spec endpoint:

`POST http://localhost:3000/v1/generate/fromschema?rowCount=10&outputFormat=csv&responseFormat=rows`

- `Content-Type` must be `text/plain`
- request body is the full multiline spec
- query params: `rowCount` (required), `outputFormat` (optional), `seed` (optional), `responseFormat` (optional: `rows|rendered|all|raw`)

Set format default options:

`POST http://localhost:3000/v1/generate/options/<format>`

Get current format default options:

`GET http://localhost:3000/v1/generate/options/<format>`

Reset format default options:

`POST http://localhost:3000/v1/generate/options/<format>/default`

Notes:

- option defaults set for a format are used when `options` are not provided to `/v1/generate` or `/v1/generate/fromschema`
- payload for `/v1/generate/options/<format>` is the same options object normally sent as `options` in generation requests

Notes:

- for JSON requests, newline characters inside string literals must be escaped as `\\n`
- use `/v1/generate/fromschema` when you want to paste raw multiline text directly

OpenAPI spec:

`GET http://localhost:3000/openapi.json`

Swagger UI:

`GET http://localhost:3000/docs`

Example request body:

```json
{
  "textSpec": "Name\nBob",
  "rowCount": 3,
  "outputFormat": "json"
}
```

## MCP Quick Start

Start the MCP server:

`npm run start --workspace @anywaydata/mcp`

Note: MCP runs over stdio in this version and does not bind to a TCP port.
OpenAPI/Swagger routes are available on the REST API only.

The server exposes one tool:

- `generate_data_from_spec`

Inputs:

- `textSpec` (required string)
- `rowCount` (required integer, >= 0)
- `outputFormat` (required string e.g. `csv`, `json`, `jsonl`, `xml`, `sql`)
- `options` (optional object)
- `seed` (optional number)

## Publishing to npm

Packages are configured with `publishConfig.access=public`.

Versioning and release notes are managed with Changesets:

1. `npx changeset`
2. Commit the generated changeset file
3. `npx changeset version`
4. `npx changeset publish`

Publish a single workspace package manually:

- `npm publish --workspace @anywaydata/core`
- `npm publish --workspace @anywaydata/cli`

## Docker

Build images from repo root:

- `docker build -f apps/api/Dockerfile -t anywaydata-api .`
- `docker build -f apps/mcp/Dockerfile -t anywaydata-mcp .`

Run the API container:

`docker run --rm -p 3000:3000 anywaydata-api`

Start both services with Compose:

`docker compose up --build`

## CI Coverage Artifacts

GitHub Actions runs linting and tests for pushes and pull requests to `master`.

The workflow also publishes coverage output as build artifacts on each run:

- `coverage-report-node-18.x` contains the full `coverage/` directory
- `coverage-html-report-node-18.x` contains the HTML report from `coverage/lcov-report/`

Open the workflow run in the Actions tab and download the artifact from the run summary page.

## Probable TODO:

- TODO: convert all JS to TypeScript
  - https://blog.logrocket.com/a-simple-guide-for-migrating-from-javascript-to-typescript/
- TODO: improve and expand the test data generation - written in TypeScript, don't use faker directly - create a full semantic abstraction
- TODO: create a DSL for the test data generation... probably just JSON initially
- TODO: convert UI to use React?

## Useful Data Sources

Large sources of data:

- https://catalog.data.gov/ca
